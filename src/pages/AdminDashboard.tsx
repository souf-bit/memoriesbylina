import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Plus, Pencil, Trash2, LogOut, Upload, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface DbProduct {
  id: string;
  name_ar: string;
  name_fr: string;
  name_nl: string;
  description_ar: string;
  description_fr: string;
  description_nl: string;
  category: 'robes' | 'jelbabs' | 'complets';
  price: number;
  sizes: string[];
  image_url: string | null;
  is_featured: boolean;
  created_at: string;
}

const emptyForm = {
  name_ar: '',
  name_fr: '',
  name_nl: '',
  description_ar: '',
  description_fr: '',
  description_nl: '',
  category: 'robes' as 'robes' | 'jelbabs' | 'complets',
  price: 0,
  sizes: ['S', 'M', 'L', 'XL'],
  is_featured: false,
};

const AdminDashboard = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
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
    if (data) setProducts(data as unknown as DbProduct[]);
  };

  useEffect(() => {
    if (isAdmin) fetchProducts();
  }, [isAdmin]);

  const invalidateProducts = () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

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
      name_nl: product.name_nl || '',
      description_ar: product.description_ar,
      description_fr: product.description_fr,
      description_nl: product.description_nl || '',
      category: product.category,
      price: product.price,
      sizes: product.sizes,
      is_featured: product.is_featured,
    });
    setImagePreview(product.image_url);
    setImageFile(null);
    setFormOpen(true);
  };

  const openNew = () => {
    setEditId(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setFormOpen(true);
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
        name_nl: form.name_nl,
        description_ar: form.description_ar,
        description_fr: form.description_fr,
        description_nl: form.description_nl,
        category: form.category,
        price: form.price,
        sizes: form.sizes,
        is_featured: form.is_featured,
        image_url: imageUrl,
      };

      if (editId) {
        const { error } = await supabase.from('products').update(payload).eq('id', editId);
        if (error) throw error;
        toast({ title: 'Product bijgewerkt ✓' });
      } else {
        const { error } = await supabase.from('products').insert(payload);
        if (error) throw error;
        toast({ title: 'Product toegevoegd ✓' });
      }

      setFormOpen(false);
      fetchProducts();
      invalidateProducts();
    } catch (err: any) {
      toast({ title: 'Fout', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      toast({ title: 'Fout', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Product verwijderd ✓' });
      fetchProducts();
      invalidateProducts();
    }
    setDeleteConfirmId(null);
  };

  const handleSizesChange = (value: string) => {
    setForm(f => ({ ...f, sizes: value.split(',').map(s => s.trim()).filter(Boolean) }));
  };

  if (loading) return <div className="flex justify-center py-20"><p>Laden...</p></div>;
  if (!isAdmin) return null;

  const productForm = (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Image upload */}
      <div className="space-y-2">
        <Label className="text-xs font-sans uppercase tracking-wider">Foto</Label>
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
            Foto kiezen
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>
      </div>

      {/* Names */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-sans uppercase tracking-wider">Naam (NL)</Label>
          <Input
            value={form.name_nl}
            onChange={(e) => setForm(f => ({ ...f, name_nl: e.target.value }))}
            className="rounded-none"
            required
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-sans uppercase tracking-wider">Naam (FR)</Label>
          <Input
            value={form.name_fr}
            onChange={(e) => setForm(f => ({ ...f, name_fr: e.target.value }))}
            className="rounded-none"
            required
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-sans uppercase tracking-wider">Naam (AR)</Label>
          <Input
            value={form.name_ar}
            onChange={(e) => setForm(f => ({ ...f, name_ar: e.target.value }))}
            className="rounded-none"
            dir="rtl"
            required
          />
        </div>
      </div>

      {/* Descriptions */}
      <div className="space-y-2">
        <Label className="text-xs font-sans uppercase tracking-wider">Beschrijving (NL)</Label>
        <Textarea
          value={form.description_nl}
          onChange={(e) => setForm(f => ({ ...f, description_nl: e.target.value }))}
          className="rounded-none"
          rows={2}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-xs font-sans uppercase tracking-wider">Beschrijving (FR)</Label>
        <Textarea
          value={form.description_fr}
          onChange={(e) => setForm(f => ({ ...f, description_fr: e.target.value }))}
          className="rounded-none"
          rows={2}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-xs font-sans uppercase tracking-wider">Beschrijving (AR)</Label>
        <Textarea
          value={form.description_ar}
          onChange={(e) => setForm(f => ({ ...f, description_ar: e.target.value }))}
          className="rounded-none"
          dir="rtl"
          rows={2}
        />
      </div>

      {/* Category, Price, Sizes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-sans uppercase tracking-wider">Categorie</Label>
          <Select
            value={form.category}
            onValueChange={(v) => setForm(f => ({ ...f, category: v as any }))}
          >
            <SelectTrigger className="rounded-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="robes">Jurken / Robes</SelectItem>
              <SelectItem value="jelbabs">Jelbabs</SelectItem>
              <SelectItem value="complets">Complets</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-sans uppercase tracking-wider">Prijs (DH)</Label>
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
          <Label className="text-xs font-sans uppercase tracking-wider">Maten</Label>
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
          Uitgelicht product
        </Label>
      </div>

      <Button
        type="submit"
        disabled={saving}
        className="w-full rounded-none py-5 text-xs uppercase tracking-[0.15em] font-sans font-medium"
      >
        {saving ? 'Opslaan...' : editId ? 'Bijwerken' : 'Toevoegen'}
      </Button>
    </form>
  );

  return (
    <main className="container py-6 sm:py-10 px-4 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-10">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground font-sans mt-1">{user?.email}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={openNew} className="rounded-none gap-2 text-xs uppercase tracking-wider font-sans flex-1 sm:flex-none">
            <Plus className="h-4 w-4" /> Nieuw product
          </Button>
          <Button variant="outline" onClick={signOut} className="rounded-none gap-2 text-xs uppercase tracking-wider font-sans">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Uitloggen</span>
          </Button>
        </div>
      </div>

      {/* Mobile: Card layout */}
      <div className="block md:hidden space-y-3">
        {products.length === 0 && (
          <p className="text-center py-12 text-muted-foreground font-sans">
            Geen producten. Voeg je eerste product toe!
          </p>
        )}
        {products.map((p) => (
          <div key={p.id} className="border border-border p-4 flex gap-4">
            {p.image_url ? (
              <img src={p.image_url} alt="" className="h-20 w-16 object-cover bg-muted flex-shrink-0" />
            ) : (
              <div className="h-20 w-16 bg-muted flex items-center justify-center flex-shrink-0">
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{p.name_nl || p.name_fr}</h3>
              <p className="text-xs text-muted-foreground capitalize mt-0.5">{p.category}</p>
              <p className="text-sm font-medium mt-1">{p.price} DH</p>
              <p className="text-xs text-muted-foreground mt-0.5">{p.sizes.join(', ')}</p>
            </div>
            <div className="flex flex-col gap-1 flex-shrink-0">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteConfirmId(p.id)}>
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Table layout */}
      <div className="hidden md:block border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-start px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Foto</th>
                <th className="text-start px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Naam</th>
                <th className="text-start px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Categorie</th>
                <th className="text-start px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Prijs</th>
                <th className="text-start px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Maten</th>
                <th className="text-end px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Acties</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground">
                    Geen producten. Voeg je eerste product toe!
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
                  <td className="px-4 py-3 font-medium">{p.name_nl || p.name_fr}</td>
                  <td className="px-4 py-3 capitalize">{p.category}</td>
                  <td className="px-4 py-3">{p.price} DH</td>
                  <td className="px-4 py-3">{p.sizes.join(', ')}</td>
                  <td className="px-4 py-3 text-end">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteConfirmId(p.id)}>
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

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Product verwijderen?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Dit kan niet ongedaan worden gemaakt. Het product wordt permanent verwijderd uit de catalogus.
          </p>
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              className="flex-1 rounded-none"
              onClick={() => setDeleteConfirmId(null)}
            >
              Annuleren
            </Button>
            <Button
              variant="destructive"
              className="flex-1 rounded-none"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
            >
              Verwijderen
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile: Sheet for form */}
      {isMobile ? (
        <Sheet open={formOpen} onOpenChange={setFormOpen}>
          <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="font-serif text-xl">
                {editId ? 'Product bewerken' : 'Nieuw product'}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              {productForm}
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">
                {editId ? 'Product bewerken' : 'Nieuw product'}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {productForm}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
};

export default AdminDashboard;