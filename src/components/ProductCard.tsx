import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import type { Product } from '@/lib/products';
import { Card, CardContent } from '@/components/ui/card';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { lang, t } = useI18n();

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={product.image}
            alt={product.name[lang]}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground">{product.name[lang]}</h3>
          <p className="mt-1 text-lg font-bold text-primary">
            {product.price} {t('product.price')}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
