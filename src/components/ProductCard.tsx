import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import type { Product } from '@/lib/products';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { lang, t } = useI18n();

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name[lang]}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="mt-4 space-y-1">
          <h3 className="font-serif text-lg font-semibold text-foreground tracking-wide">
            {product.name[lang]}
          </h3>
          <p className="font-sans text-sm font-medium text-primary tracking-wider">
            {product.price} {t('product.price')}
          </p>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
