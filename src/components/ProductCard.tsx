import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import type { Product } from '@/lib/products';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { lang, t } = useI18n();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const displayLang = lang === 'nl' ? 'fr' : lang;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 'M');
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="aspect-[3/4] overflow-hidden bg-muted relative">
          <img
            src={product.image}
            alt={product.name[displayLang]}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <button
            onClick={handleQuickAdd}
            className={`absolute bottom-3 end-3 h-10 w-10 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 ${
              added
                ? 'bg-[hsl(142,70%,40%)] text-white scale-110'
                : 'bg-background/90 text-foreground opacity-0 group-hover:opacity-100 hover:bg-foreground hover:text-background'
            }`}
            aria-label={t('product.addToCart')}
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 space-y-1">
          <h3 className="font-serif text-lg font-semibold text-foreground tracking-wide">
            {product.name[displayLang]}
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