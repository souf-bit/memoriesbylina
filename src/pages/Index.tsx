import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { products } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import heroBanner from '@/assets/hero-banner.jpg';

const categories = [
  { id: 'robes', image: products.find(p => p.category === 'robes')!.image },
  { id: 'jelbabs', image: products.find(p => p.category === 'jelbabs')!.image },
  { id: 'complets', image: products.find(p => p.category === 'complets')!.image },
] as const;

const Index = () => {
  const { t } = useI18n();
  const featured = products.slice(0, 4);

  return (
    <main>
      {/* Hero Banner */}
      <section className="relative h-[70vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <img src={heroBanner} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
        <div className="relative z-10 text-center px-4">
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-4">
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
            {t('hero.subtitle')}
          </p>
          <Button asChild size="lg" className="rounded-full px-8">
            <Link to="/catalog">{t('hero.cta')}</Link>
          </Button>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-16">
        <h2 className="font-serif text-3xl font-bold text-center mb-10">{t('sections.title')}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/catalog?category=${cat.id}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl"
            >
              <img
                src={cat.image}
                alt={t(`sections.${cat.id}`)}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
              <div className="absolute bottom-0 p-6">
                <h3 className="text-2xl font-bold text-background">{t(`sections.${cat.id}`)}</h3>
                <p className="text-sm text-background/80 mt-1">{t(`sections.${cat.id}.desc`)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-secondary/30 py-16">
        <div className="container">
          <h2 className="font-serif text-3xl font-bold text-center mb-10">{t('featured.title')}</h2>
          <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg" className="rounded-full px-8">
              <Link to="/catalog">{t('nav.catalog')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
