import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { products, getWhatsAppLink } from '@/lib/products';
import { Button } from '@/components/ui/button';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { lang, t } = useI18n();
  const [selectedSize, setSelectedSize] = useState('M');

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Product not found</p>
        <Button asChild variant="link" className="mt-4">
          <Link to="/catalog">{t('nav.catalog')}</Link>
        </Button>
      </div>
    );
  }

  const whatsappLink = getWhatsAppLink(product.name[lang], selectedSize, product.price, lang);

  return (
    <main className="container py-10">
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link to="/catalog">
          <ArrowLeft className="h-4 w-4 me-1" />
          {t('nav.catalog')}
        </Link>
      </Button>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="aspect-[3/4] overflow-hidden rounded-2xl">
          <img
            src={product.image}
            alt={product.name[lang]}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="font-serif text-3xl font-bold">{product.name[lang]}</h1>
          <p className="mt-3 text-2xl font-bold text-primary">
            {product.price} {t('product.price')}
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {product.description[lang]}
          </p>

          <div className="mt-8">
            <label className="text-sm font-medium">{t('product.size')}</label>
            <div className="flex gap-3 mt-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-medium transition-all ${
                    selectedSize === size
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border hover:border-primary'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="mt-8">
            <Button size="lg" className="w-full rounded-full gap-2 bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-white">
              <MessageCircle className="h-5 w-5" />
              {t('product.order')}
            </Button>
          </a>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
