import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Check } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useCart } from '@/lib/cart';
import { useProduct } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { lang, t } = useI18n();
  const { addItem } = useCart();
  const { product, isLoading } = useProduct(id);
  const [selectedSize, setSelectedSize] = useState('M');
  const [added, setAdded] = useState(false);

  const displayLang = lang === 'nl' ? 'fr' : lang;

  if (isLoading) {
    return (
      <main className="container py-12">
        <Skeleton className="h-4 w-32 mb-10" />
        <div className="grid gap-12 md:grid-cols-2 lg:gap-20">
          <Skeleton className="aspect-[3/4] w-full" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">{t('product.notFound')}</p>
        <Button asChild variant="link" className="mt-4">
          <Link to="/catalog">{t('nav.catalog')}</Link>
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <main className="container py-12">
      <Link
        to="/catalog"
        className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors mb-10"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {t('nav.catalog')}
      </Link>

      <div className="grid gap-12 md:grid-cols-2 lg:gap-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="aspect-[3/4] overflow-hidden bg-muted"
        >
          <img
            src={product.image}
            alt={product.name[displayLang]}
            className="h-full w-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col justify-center"
        >
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
            {t(`sections.${product.category}`)}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold leading-tight">
            {product.name[displayLang]}
          </h1>
          <p className="mt-4 font-serif text-2xl text-primary font-semibold">
            {product.price} {t('product.price')}
          </p>
          <p className="mt-6 text-muted-foreground font-light leading-relaxed">
            {product.description[displayLang]}
          </p>

          <div className="mt-10">
            <label className="text-xs font-sans uppercase tracking-[0.2em] text-muted-foreground">
              {t('product.size')}
            </label>
            <div className="flex gap-3 mt-4">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`flex h-14 w-14 items-center justify-center border text-sm font-sans font-medium tracking-wider transition-all duration-200 ${
                    selectedSize === size
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border hover:border-foreground text-foreground'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <Button
            size="lg"
            onClick={handleAddToCart}
            className={`mt-10 w-full rounded-none py-7 gap-3 text-xs uppercase tracking-[0.2em] font-sans font-medium transition-all duration-300 ${
              added
                ? 'bg-[hsl(142,70%,40%)] hover:bg-[hsl(142,70%,35%)] text-white'
                : 'bg-foreground text-background hover:bg-foreground/90'
            }`}
          >
            {added ? (
              <>
                <Check className="h-4 w-4" />
                {t('product.added')}
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" />
                {t('product.addToCart')}
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </main>
  );
};

export default ProductDetail;