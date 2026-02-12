import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, LogOut, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DbProduct {
  id: string;
  name_ar: string;
  name_fr: string;
  description_ar: string;
  description_fr: string;
  category: 'robes' | 'jelbabs' | 'complets';
  price: number;
  sizes: string[];
  image_url: string | null;
  is_featured: boolean;
  created_at: string;
}

const emptyForm: {
  name_ar: string;
  name_fr: string;
  description_ar: string;
  description_fr: string;
  category: 'robes' | 'jelbabs' | 'complets';
  price: number;
  sizes: string[];
  is_featured: boolean;
} = {
  name_ar: '',
  name_fr: '',
  description_ar: '',
  description_fr: '',
  category: 'robes',
  price: 0,
  sizes: ['S', 'M', 'L', 'XL'],
  is_featured: false,
};

const AdminDashboard = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, loading, navigate]);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setProducts(data as DbProduct[]);
  };

  useEffect(() => {
    if (isAdmin) fetchProducts();
  }, [isAdmin]);

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from('product-images')
      .upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    return data.publicUrl;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const openEdit = (product: DbProduct) => {
    setEditId(product.id);
    setForm({
      name_ar: product.name_ar,
      name_fr: product.name_fr,
      description_ar: product.description_ar,
      description_fr: product.description_fr,
      category: product.category,
      price: product.price,
      sizes: product.sizes,
      is_featured: product.is_featured,
    });
    setImagePreview(product.image_url);
    setImageFile(null);
    setDialogOpen(true);
  };

  const openNew = () => {
    setEditId(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrl = editId ? products.find(p => p.id === editId)?.image_url ?? null : null;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        name_ar: form.name_ar,
        name_fr: form.name_fr,
        description_ar: form.description_ar,
        description_fr: form.description_fr,
        category: form.category,
        price: form.price,
        sizes: form.sizes,
        is_featured: form.is_featured,
        image_url: imageUrl,
      };

      if (editId) {
        const { error } = await supabase.from('products').update(payload).eq('id', editId);
        if (error) throw error;
        toast({ title: 'Produit mis à jour' });
      } else {
        const { error } = await supabase.from('products').insert(payload);
        if (error) throw error;
        toast({ title: 'Produit ajouté' });
      }

      setDialogOpen(false);
      fetchProducts();
    } catch (err: any) {
      toast({ title: 'Erreur', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Produit supprimé' });
      fetchProducts();
    }
  };

  const handleSizesChange = (value: string) => {
    setForm(f => ({ ...f, sizes: value.split(',').map(s => s.trim()).filter(Boolean) }));
  };

  if (loading) return <div className="flex justify-center py-20"><p>Chargement...</p></div>;
  if (!isAdmin) return null;

  return (
    <main className="container py-10 max-w-5xl">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Dashboard Admin</h1>
          <p className="text-sm text-muted-foreground font-sans mt-1">{user?.email}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={openNew} className="rounded-none gap-2 text-xs uppercase tracking-wider font-sans">
            <Plus className="h-4 w-4" /> Nouveau produit
          </Button>
          <Button variant="outline" onClick={signOut} className="rounded-none gap-2 text-xs uppercase tracking-wider font-sans">
            <LogOut className="h-4 w-4" /> Déconnexion
          </Button>
        </div>
      </div>

      {/* Products table */}
      <div className="border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-start px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Image</th>
                <th className="text-start px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Nom (FR)</th>
                <th className="text-start px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Catégorie</th>
                <th className="text-start px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Prix</th>
                <th className="text-start px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Tailles</th>
                <th className="text-end px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground">
                    Aucun produit. Ajoutez votre premier produit !
                  </td>
                </tr>
              )}
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    {p.image_url ? (
                      <img src={p.image_url} alt="" className="h-14 w-12 object-cover bg-muted" />
                    ) : (
                      <div className="h-14 w-12 bg-muted flex items-center justify-center">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{p.name_fr}</td>
                  <td className="px-4 py-3 capitalize">{p.category}</td>
                  <td className="px-4 py-3">{p.price} DH</td>
                  <td className="px-4 py-3">{p.sizes.join(', ')}</td>
                  <td className="px-4 py-3 text-end">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {editId ? 'Modifier le produit' : 'Nouveau produit'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Image upload */}
            <div className="space-y-2">
              <Label className="text-xs font-sans uppercase tracking-wider">Photo</Label>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <img src={imagePreview} alt="" className="h-24 w-20 object-cover bg-muted" />
                ) : (
                  <div className="h-24 w-20 bg-muted flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-border text-xs uppercase tracking-wider font-sans font-medium hover:bg-muted transition-colors">
                  <Upload className="h-4 w-4" />
                  Choisir une photo
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-sans uppercase tracking-wider">Nom (FR)</Label>
                <Input
                  value={form.name_fr}
                  onChange={(e) => setForm(f => ({ ...f, name_fr: e.target.value }))}
                  className="rounded-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-sans uppercase tracking-wider">Nom (AR)</Label>
                <Input
                  value={form.name_ar}
                  onChange={(e) => setForm(f => ({ ...f, name_ar: e.target.value }))}
                  className="rounded-none"
                  dir="rtl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-sans uppercase tracking-wider">Description (FR)</Label>
              <Textarea
                value={form.description_fr}
                onChange={(e) => setForm(f => ({ ...f, description_fr: e.target.value }))}
                className="rounded-none"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-sans uppercase tracking-wider">Description (AR)</Label>
              <Textarea
                value={form.description_ar}
                onChange={(e) => setForm(f => ({ ...f, description_ar: e.target.value }))}
                className="rounded-none"
                dir="rtl"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-sans uppercase tracking-wider">Catégorie</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm(f => ({ ...f, category: v as any }))}
                >
                  <SelectTrigger className="rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="robes">Robes</SelectItem>
                    <SelectItem value="jelbabs">Jelbabs</SelectItem>
                    <SelectItem value="complets">Complets</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-sans uppercase tracking-wider">Prix (DH)</Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                  className="rounded-none"
                  required
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-sans uppercase tracking-wider">Tailles</Label>
                <Input
                  value={form.sizes.join(', ')}
                  onChange={(e) => handleSizesChange(e.target.value)}
                  className="rounded-none"
                  placeholder="S, M, L, XL"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={form.is_featured}
                onChange={(e) => setForm(f => ({ ...f, is_featured: e.target.checked }))}
              />
              <Label htmlFor="featured" className="text-xs font-sans uppercase tracking-wider cursor-pointer">
                Produit vedette
              </Label>
            </div>

            <Button
              type="submit"
              disabled={saving}
              className="w-full rounded-none py-5 text-xs uppercase tracking-[0.15em] font-sans font-medium"
            >
              {saving ? 'Enregistrement...' : editId ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default AdminDashboard;
