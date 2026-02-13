import { useState, useEffect, useMemo } from 'react';
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
import {
  Plus, Pencil, Trash2, LogOut, Upload, Image as ImageIcon, AlertTriangle,
  Package, Star, Grid3X3, TrendingUp, Eye, ShoppingBag
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

const GOLD = '#C9A050';
const GOLD_LIGHT = '#D4B06A';
const DARK_BG = '#0F0F0F';
const DARK_CARD = '#1A1A1A';
const DARK_BORDER = '#2A2A2A';
const DARK_MUTED = '#888888';
const PIE_COLORS = [GOLD, '#8B6E3B', '#E8D5A8'];

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
  const [activeTab, setActiveTab] = useState<'overview' | 'products'>('overview');

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

  // Stats
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const featured = products.filter(p => p.is_featured).length;
    const avgPrice = totalProducts > 0 ? Math.round(products.reduce((s, p) => s + p.price, 0) / totalProducts) : 0;
    const categories = {
      robes: products.filter(p => p.category === 'robes').length,
      jelbabs: products.filter(p => p.category === 'jelbabs').length,
      complets: products.filter(p => p.category === 'complets').length,
    };
    return { totalProducts, featured, avgPrice, categories };
  }, [products]);

  const categoryData = [
    { name: 'Robes', value: stats.categories.robes },
    { name: 'Jelbabs', value: stats.categories.jelbabs },
    { name: 'Complets', value: stats.categories.complets },
  ].filter(d => d.value > 0);

  const priceDistribution = useMemo(() => {
    const ranges = [
      { name: '0-200', min: 0, max: 200 },
      { name: '200-400', min: 200, max: 400 },
      { name: '400-600', min: 400, max: 600 },
      { name: '600-800', min: 600, max: 800 },
      { name: '800+', min: 800, max: Infinity },
    ];
    return ranges.map(r => ({
      range: r.name,
      count: products.filter(p => p.price >= r.min && p.price < r.max).length,
    }));
  }, [products]);

  // File upload
  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const MIME_TO_EXT: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

  const uploadImage = async (file: File): Promise<string> => {
    const ext = MIME_TO_EXT[file.type] || 'jpg';
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    return data.publicUrl;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast({ title: 'Fout', description: 'Bestand moet kleiner zijn dan 5MB', variant: 'destructive' });
        return;
      }
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        toast({ title: 'Fout', description: 'Alleen JPEG, PNG en WebP toegestaan', variant: 'destructive' });
        return;
      }
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
      if (imageFile) imageUrl = await uploadImage(imageFile);
      const payload = {
        name_ar: form.name_ar, name_fr: form.name_fr, name_nl: form.name_nl,
        description_ar: form.description_ar, description_fr: form.description_fr, description_nl: form.description_nl,
        category: form.category, price: form.price, sizes: form.sizes, is_featured: form.is_featured, image_url: imageUrl,
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

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center" style={{ background: DARK_BG }}>
      <div className="animate-pulse" style={{ color: GOLD }}>
        <Package className="h-8 w-8" />
      </div>
    </div>
  );
  if (!isAdmin) return null;

  const StatCard = ({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string | number; sub?: string }) => (
    <div className="p-5 rounded-lg border" style={{ background: DARK_CARD, borderColor: DARK_BORDER }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-[0.15em] font-sans" style={{ color: DARK_MUTED }}>{label}</span>
        <div className="h-8 w-8 rounded-md flex items-center justify-center" style={{ background: `${GOLD}15` }}>
          <Icon className="h-4 w-4" style={{ color: GOLD }} />
        </div>
      </div>
      <p className="text-2xl font-serif font-semibold text-white">{value}</p>
      {sub && <p className="text-xs mt-1 font-sans" style={{ color: DARK_MUTED }}>{sub}</p>}
    </div>
  );

  const productForm = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs font-sans uppercase tracking-wider" style={{ color: DARK_MUTED }}>Foto</Label>
        <div className="flex items-center gap-4">
          {imagePreview ? (
            <img src={imagePreview} alt="" className="h-24 w-20 object-cover rounded" style={{ background: DARK_BORDER }} />
          ) : (
            <div className="h-24 w-20 rounded flex items-center justify-center" style={{ background: DARK_BORDER }}>
              <ImageIcon className="h-8 w-8" style={{ color: DARK_MUTED }} />
            </div>
          )}
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded text-xs uppercase tracking-wider font-sans font-medium transition-colors border" style={{ borderColor: DARK_BORDER, color: 'white' }}>
            <Upload className="h-4 w-4" />
            Foto kiezen
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="hidden" />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { key: 'name_nl', label: 'Naam (NL)' },
          { key: 'name_fr', label: 'Naam (FR)' },
          { key: 'name_ar', label: 'Naam (AR)', dir: 'rtl' as const },
        ].map(f => (
          <div key={f.key} className="space-y-2">
            <Label className="text-xs font-sans uppercase tracking-wider" style={{ color: DARK_MUTED }}>{f.label}</Label>
            <Input
              value={(form as any)[f.key]}
              onChange={(e) => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
              dir={f.dir}
              required
              className="rounded border-0"
              style={{ background: DARK_BORDER, color: 'white' }}
            />
          </div>
        ))}
      </div>

      {[
        { key: 'description_nl', label: 'Beschrijving (NL)' },
        { key: 'description_fr', label: 'Beschrijving (FR)' },
        { key: 'description_ar', label: 'Beschrijving (AR)', dir: 'rtl' as const },
      ].map(f => (
        <div key={f.key} className="space-y-2">
          <Label className="text-xs font-sans uppercase tracking-wider" style={{ color: DARK_MUTED }}>{f.label}</Label>
          <Textarea
            value={(form as any)[f.key]}
            onChange={(e) => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
            dir={f.dir}
            rows={2}
            className="rounded border-0"
            style={{ background: DARK_BORDER, color: 'white' }}
          />
        </div>
      ))}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-sans uppercase tracking-wider" style={{ color: DARK_MUTED }}>Categorie</Label>
          <Select value={form.category} onValueChange={(v) => setForm(f => ({ ...f, category: v as any }))}>
            <SelectTrigger className="rounded border-0" style={{ background: DARK_BORDER, color: 'white' }}>
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
          <Label className="text-xs font-sans uppercase tracking-wider" style={{ color: DARK_MUTED }}>Prijs (DH)</Label>
          <Input
            type="number"
            value={form.price}
            onChange={(e) => setForm(f => ({ ...f, price: Number(e.target.value) }))}
            required
            min={0}
            className="rounded border-0"
            style={{ background: DARK_BORDER, color: 'white' }}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-sans uppercase tracking-wider" style={{ color: DARK_MUTED }}>Maten</Label>
          <Input
            value={form.sizes.join(', ')}
            onChange={(e) => handleSizesChange(e.target.value)}
            placeholder="S, M, L, XL"
            className="rounded border-0"
            style={{ background: DARK_BORDER, color: 'white' }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          checked={form.is_featured}
          onChange={(e) => setForm(f => ({ ...f, is_featured: e.target.checked }))}
          className="accent-amber-600"
        />
        <Label htmlFor="featured" className="text-xs font-sans uppercase tracking-wider cursor-pointer" style={{ color: DARK_MUTED }}>
          Uitgelicht product
        </Label>
      </div>

      <Button
        type="submit"
        disabled={saving}
        className="w-full rounded py-5 text-xs uppercase tracking-[0.15em] font-sans font-medium border-0"
        style={{ background: GOLD, color: '#0F0F0F' }}
      >
        {saving ? 'Opslaan...' : editId ? 'Bijwerken' : 'Toevoegen'}
      </Button>
    </form>
  );

  return (
    <div className="min-h-screen" style={{ background: DARK_BG, color: 'white' }}>
      {/* Top bar */}
      <header className="border-b px-4 sm:px-8 py-4 flex items-center justify-between" style={{ borderColor: DARK_BORDER, background: DARK_CARD }}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md flex items-center justify-center" style={{ background: GOLD }}>
            <ShoppingBag className="h-4 w-4" style={{ color: DARK_BG }} />
          </div>
          <div>
            <h1 className="font-serif text-lg font-semibold tracking-tight" style={{ color: GOLD }}>Élégance</h1>
            <p className="text-[10px] font-sans uppercase tracking-[0.2em]" style={{ color: DARK_MUTED }}>Admin Panel</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-sans hidden sm:block" style={{ color: DARK_MUTED }}>{user?.email}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="gap-2 text-xs uppercase tracking-wider font-sans rounded hover:bg-white/5"
            style={{ color: DARK_MUTED }}
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Uitloggen</span>
          </Button>
        </div>
      </header>

      {/* Tab navigation */}
      <div className="border-b px-4 sm:px-8 flex gap-1" style={{ borderColor: DARK_BORDER }}>
        {[
          { id: 'overview' as const, label: 'Overzicht', icon: Eye },
          { id: 'products' as const, label: 'Producten', icon: Package },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-3 text-xs font-sans uppercase tracking-[0.15em] transition-colors border-b-2 -mb-px"
            style={{
              borderColor: activeTab === tab.id ? GOLD : 'transparent',
              color: activeTab === tab.id ? GOLD : DARK_MUTED,
            }}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      <main className="px-4 sm:px-8 py-6 max-w-7xl mx-auto">
        {/* === OVERVIEW TAB === */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Package} label="Producten" value={stats.totalProducts} sub="Totale catalogus" />
              <StatCard icon={Star} label="Uitgelicht" value={stats.featured} sub="Gemarkeerd als featured" />
              <StatCard icon={TrendingUp} label="Gem. Prijs" value={`${stats.avgPrice} DH`} sub="Gemiddelde productprijs" />
              <StatCard icon={Grid3X3} label="Categorieën" value={3} sub="Robes, Jelbabs, Complets" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Price distribution */}
              <div className="p-5 rounded-lg border" style={{ background: DARK_CARD, borderColor: DARK_BORDER }}>
                <h3 className="text-xs uppercase tracking-[0.15em] font-sans mb-4" style={{ color: DARK_MUTED }}>
                  Prijsverdeling (DH)
                </h3>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={priceDistribution}>
                      <XAxis dataKey="range" tick={{ fill: DARK_MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: DARK_MUTED, fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ background: DARK_CARD, border: `1px solid ${DARK_BORDER}`, borderRadius: 8, color: 'white', fontSize: 12 }}
                        labelStyle={{ color: GOLD }}
                      />
                      <Bar dataKey="count" fill={GOLD} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category pie chart */}
              <div className="p-5 rounded-lg border" style={{ background: DARK_CARD, borderColor: DARK_BORDER }}>
                <h3 className="text-xs uppercase tracking-[0.15em] font-sans mb-4" style={{ color: DARK_MUTED }}>
                  Categorie Verdeling
                </h3>
                <div className="h-52 flex items-center justify-center">
                  {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          dataKey="value"
                          strokeWidth={0}
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {categoryData.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ background: DARK_CARD, border: `1px solid ${DARK_BORDER}`, borderRadius: 8, color: 'white', fontSize: 12 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm" style={{ color: DARK_MUTED }}>Geen producten</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recent products */}
            <div className="p-5 rounded-lg border" style={{ background: DARK_CARD, borderColor: DARK_BORDER }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs uppercase tracking-[0.15em] font-sans" style={{ color: DARK_MUTED }}>
                  Recente Producten
                </h3>
                <button
                  onClick={() => setActiveTab('products')}
                  className="text-xs font-sans underline"
                  style={{ color: GOLD }}
                >
                  Bekijk alles →
                </button>
              </div>
              <div className="space-y-3">
                {products.slice(0, 5).map(p => (
                  <div key={p.id} className="flex items-center gap-4 p-3 rounded-lg transition-colors" style={{ background: `${DARK_BORDER}50` }}>
                    {p.image_url ? (
                      <img src={p.image_url} alt="" className="h-12 w-10 object-cover rounded" />
                    ) : (
                      <div className="h-12 w-10 rounded flex items-center justify-center" style={{ background: DARK_BORDER }}>
                        <ImageIcon className="h-4 w-4" style={{ color: DARK_MUTED }} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.name_nl || p.name_fr}</p>
                      <p className="text-xs capitalize" style={{ color: DARK_MUTED }}>{p.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium" style={{ color: GOLD }}>{p.price} DH</p>
                      {p.is_featured && (
                        <Star className="h-3 w-3 inline-block" style={{ color: GOLD }} fill={GOLD} />
                      )}
                    </div>
                  </div>
                ))}
                {products.length === 0 && (
                  <p className="text-center py-8 text-sm" style={{ color: DARK_MUTED }}>Nog geen producten</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* === PRODUCTS TAB === */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-semibold" style={{ color: GOLD }}>Catalogus beheer</h2>
              <Button
                onClick={openNew}
                className="gap-2 text-xs uppercase tracking-wider font-sans rounded"
                style={{ background: GOLD, color: DARK_BG }}
              >
                <Plus className="h-4 w-4" /> Nieuw product
              </Button>
            </div>

            {/* Mobile: Card layout */}
            <div className="block md:hidden space-y-3">
              {products.length === 0 && (
                <p className="text-center py-12" style={{ color: DARK_MUTED }}>Geen producten. Voeg je eerste product toe!</p>
              )}
              {products.map(p => (
                <div key={p.id} className="p-4 rounded-lg border flex gap-4" style={{ background: DARK_CARD, borderColor: DARK_BORDER }}>
                  {p.image_url ? (
                    <img src={p.image_url} alt="" className="h-20 w-16 object-cover rounded flex-shrink-0" />
                  ) : (
                    <div className="h-20 w-16 rounded flex items-center justify-center flex-shrink-0" style={{ background: DARK_BORDER }}>
                      <ImageIcon className="h-5 w-5" style={{ color: DARK_MUTED }} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{p.name_nl || p.name_fr}</h3>
                    <p className="text-xs capitalize mt-0.5" style={{ color: DARK_MUTED }}>{p.category}</p>
                    <p className="text-sm font-medium mt-1" style={{ color: GOLD }}>{p.price} DH</p>
                    <p className="text-xs mt-0.5" style={{ color: DARK_MUTED }}>{p.sizes.join(', ')}</p>
                  </div>
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5" onClick={() => openEdit(p)}>
                      <Pencil className="h-3.5 w-3.5" style={{ color: GOLD }} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5" onClick={() => setDeleteConfirmId(p.id)}>
                      <Trash2 className="h-3.5 w-3.5 text-red-400" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Table */}
            <div className="hidden md:block rounded-lg border overflow-hidden" style={{ borderColor: DARK_BORDER }}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-sans">
                  <thead>
                    <tr style={{ background: `${DARK_BORDER}80` }}>
                      {['Foto', 'Naam', 'Categorie', 'Prijs', 'Maten', 'Status', 'Acties'].map(h => (
                        <th key={h} className={`px-4 py-3 text-xs uppercase tracking-wider font-medium ${h === 'Acties' ? 'text-end' : 'text-start'}`} style={{ color: DARK_MUTED }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 && (
                      <tr><td colSpan={7} className="text-center py-12" style={{ color: DARK_MUTED }}>Geen producten</td></tr>
                    )}
                    {products.map(p => (
                      <tr key={p.id} className="border-t transition-colors hover:bg-white/[0.02]" style={{ borderColor: DARK_BORDER }}>
                        <td className="px-4 py-3">
                          {p.image_url ? (
                            <img src={p.image_url} alt="" className="h-14 w-12 object-cover rounded" />
                          ) : (
                            <div className="h-14 w-12 rounded flex items-center justify-center" style={{ background: DARK_BORDER }}>
                              <ImageIcon className="h-5 w-5" style={{ color: DARK_MUTED }} />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium">{p.name_nl || p.name_fr}</td>
                        <td className="px-4 py-3 capitalize">{p.category}</td>
                        <td className="px-4 py-3" style={{ color: GOLD }}>{p.price} DH</td>
                        <td className="px-4 py-3" style={{ color: DARK_MUTED }}>{p.sizes.join(', ')}</td>
                        <td className="px-4 py-3">
                          {p.is_featured && (
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ background: `${GOLD}20`, color: GOLD }}>
                              <Star className="h-3 w-3" fill={GOLD} /> Featured
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-end">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="hover:bg-white/5" onClick={() => openEdit(p)}>
                              <Pencil className="h-4 w-4" style={{ color: GOLD }} />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:bg-white/5" onClick={() => setDeleteConfirmId(p.id)}>
                              <Trash2 className="h-4 w-4 text-red-400" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent className="max-w-sm border-0" style={{ background: DARK_CARD, color: 'white' }}>
          <DialogHeader>
            <DialogTitle className="font-serif text-xl flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Product verwijderen?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm" style={{ color: DARK_MUTED }}>
            Dit kan niet ongedaan worden gemaakt. Het product wordt permanent verwijderd.
          </p>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1 rounded border" onClick={() => setDeleteConfirmId(null)} style={{ borderColor: DARK_BORDER, color: 'white', background: 'transparent' }}>
              Annuleren
            </Button>
            <Button className="flex-1 rounded bg-red-600 hover:bg-red-700 text-white border-0" onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}>
              Verwijderen
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Form modal/sheet */}
      {isMobile ? (
        <Sheet open={formOpen} onOpenChange={setFormOpen}>
          <SheetContent side="bottom" className="h-[90vh] overflow-y-auto border-0" style={{ background: DARK_CARD, color: 'white' }}>
            <SheetHeader>
              <SheetTitle className="font-serif text-xl" style={{ color: GOLD }}>
                {editId ? 'Product bewerken' : 'Nieuw product'}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-4">{productForm}</div>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-0" style={{ background: DARK_CARD, color: 'white' }}>
            <DialogHeader>
              <DialogTitle className="font-serif text-xl" style={{ color: GOLD }}>
                {editId ? 'Product bewerken' : 'Nieuw product'}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">{productForm}</div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminDashboard;
