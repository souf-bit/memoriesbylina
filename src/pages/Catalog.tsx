import { useSearchParams } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { products, type Category } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';

const categoryKeys: (Category | 'all')[] = ['all', 'robes', 'jelbabs', 'complets'];

const Catalog = () => {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = (searchParams.get('category') as Category) || 'all';

  const filtered = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <main className="container py-10">
      <h1 className="font-serif text-3xl font-bold mb-8">{t('catalog.title')}</h1>

      <div className="flex flex-wrap gap-2 mb-8">
        {categoryKeys.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
            onClick={() => {
              if (cat === 'all') {
                setSearchParams({});
              } else {
                setSearchParams({ category: cat });
              }
            }}
          >
            {cat === 'all' ? t('catalog.all') : t(`sections.${cat}`)}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
};

export default Catalog;
