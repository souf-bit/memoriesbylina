import { useSearchParams } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useProducts } from '@/hooks/useProducts';
import type { Category } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

const categoryKeys: (Category | 'all')[] = ['all', 'robes', 'jelbabs', 'complets'];

const Catalog = () => {
  const { t } = useI18n();
  const { products, isLoading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = (searchParams.get('category') as Category) || 'all';

  const filtered = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <main className="container py-16">
      <div className="text-center mb-16">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
          {t('catalog.label')}
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-semibold">{t('catalog.title')}</h1>
      </div>

      <div className="flex justify-center flex-wrap gap-1 mb-16">
        {categoryKeys.map((cat) => (
          <button
            key={cat}
            className={`px-6 py-3 text-xs font-sans uppercase tracking-[0.15em] font-medium transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => {
              if (cat === 'all') {
                setSearchParams({});
              } else {
                setSearchParams({ category: cat });
              }
            }}
          >
            {cat === 'all' ? t('catalog.all') : t(`sections.${cat}`)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-[3/4] w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          layout
          className="grid gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="relative"
            >
              {product.stockQty === 0 && (
                <div className="absolute top-3 left-3 z-10 bg-destructive text-destructive-foreground text-[10px] font-sans uppercase tracking-wider px-2 py-1 rounded-sm">
                  {t('product.soldOut')}
                </div>
              )}
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </main>
  );
};

export default Catalog;