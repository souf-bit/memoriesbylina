import { useSearchParams } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { products, type Category } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';

const categoryKeys: (Category | 'all')[] = ['all', 'robes', 'jelbabs', 'complets'];

const Catalog = () => {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = (searchParams.get('category') as Category) || 'all';

  const filtered = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <main className="container py-16">
      <div className="text-center mb-16">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
          Collection
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
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
};

export default Catalog;
