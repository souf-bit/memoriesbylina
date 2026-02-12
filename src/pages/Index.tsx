import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useProducts } from '@/hooks/useProducts';
import { products as staticProducts } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import heroBanner from '@/assets/hero-banner.jpg';

const categories = [
  { id: 'robes', image: staticProducts.find(p => p.category === 'robes')!.image },
  { id: 'jelbabs', image: staticProducts.find(p => p.category === 'jelbabs')!.image },
  { id: 'complets', image: staticProducts.find(p => p.category === 'complets')!.image },
] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0, 0, 0.2, 1] as const },
  }),
};

const Index = () => {
  const { t } = useI18n();
  const { featured } = useProducts();

  return (
    <main>
      {/* Hero Banner */}
      <section className="relative h-[85vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <img src={heroBanner} alt={t('hero.title')} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-background/30" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4"
        >
          <p className="font-sans text-xs uppercase tracking-[0.4em] text-muted-foreground mb-6">
            {t('hero.label')}
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-semibold text-foreground mb-6 leading-tight">
            {t('hero.title')}
          </h1>
          <p className="font-sans text-base md:text-lg text-muted-foreground mb-10 max-w-lg mx-auto font-light">
            {t('hero.subtitle')}
          </p>
          <Button asChild size="lg" className="rounded-none px-12 py-6 text-xs uppercase tracking-[0.2em] font-sans font-medium bg-foreground text-background hover:bg-foreground/90">
            <Link to="/catalog">{t('hero.cta')}</Link>
          </Button>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="container py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} custom={0} className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            {t('sections.label')}
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="font-serif text-4xl md:text-5xl font-semibold">
            {t('sections.title')}
          </motion.h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
            >
              <Link
                to={`/catalog?category=${cat.id}`}
                className="group relative block aspect-[3/4] overflow-hidden"
              >
                <img
                  src={cat.image}
                  alt={t(`sections.${cat.id}`)}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-background/60 mb-2">
                    {t(`sections.${cat.id}.desc`)}
                  </p>
                  <h3 className="font-serif text-3xl font-semibold text-background">
                    {t(`sections.${cat.id}`)}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="container">
        <div className="h-px bg-border" />
      </div>

      {/* Featured Products */}
      <section className="py-24">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
              {t('featured.label')}
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-serif text-4xl md:text-5xl font-semibold">
              {t('featured.title')}
            </motion.h2>
          </motion.div>

          <div className="grid gap-8 grid-cols-2 md:grid-cols-4">
            {featured.slice(0, 4).map((product, i) => (
              <motion.div
                key={product.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button asChild variant="outline" size="lg" className="rounded-none px-12 py-6 text-xs uppercase tracking-[0.2em] font-sans font-medium border-foreground text-foreground hover:bg-foreground hover:text-background">
              <Link to="/catalog">{t('nav.catalog')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;