import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart';
import { useI18n } from '@/lib/i18n';
import { getWhatsAppCartLink } from '@/lib/products';
import { MessageCircle, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, clearCart, totalPrice, totalItems } = useCart();
  const { lang, t } = useI18n();

  const whatsappLink = getWhatsAppCartLink(items, lang);
  const displayLang = lang === 'nl' ? 'fr' : lang;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side={lang === 'ar' ? 'left' : 'right'} className="flex flex-col w-full sm:max-w-md p-0">
        <SheetHeader className="px-6 py-5 border-b border-border">
          <SheetTitle className="font-serif text-xl flex items-center gap-3">
            <ShoppingBag className="h-5 w-5" />
            {t('cart.title')}
            {totalItems > 0 && (
              <span className="text-xs font-sans bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <ShoppingBag className="h-16 w-16 opacity-20" />
            <p className="font-sans text-sm">{t('cart.empty')}</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={`${item.product.id}-${item.size}`}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 border-b border-border pb-4"
                  >
                    <div className="h-24 w-20 flex-shrink-0 overflow-hidden bg-muted">
                      <img
                        src={item.product.image}
                        alt={item.product.name[displayLang]}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-sm font-semibold truncate">
                        {item.product.name[displayLang]}
                      </h4>
                      <p className="text-xs text-muted-foreground font-sans mt-1">
                        {t('product.size')}: {item.size}
                      </p>
                      <p className="text-sm font-semibold text-primary mt-1 font-sans">
                        {item.product.price * item.quantity} {t('product.price')}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                          className="h-7 w-7 flex items-center justify-center border border-border hover:bg-muted transition-colors"
                          aria-label="-"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-sans font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                          className="h-7 w-7 flex items-center justify-center border border-border hover:bg-muted transition-colors"
                          aria-label="+"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => removeItem(item.product.id, item.size)}
                          className="ms-auto h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Remove"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="border-t border-border px-6 py-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-sans text-sm text-muted-foreground">
                  {t('cart.total')}
                </span>
                <span className="font-serif text-xl font-semibold">
                  {totalPrice} {t('product.price')}
                </span>
              </div>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block">
                <Button
                  size="lg"
                  className="w-full rounded-none py-6 gap-3 text-xs uppercase tracking-[0.15em] font-sans font-medium bg-[hsl(142,70%,40%)] hover:bg-[hsl(142,70%,35%)] text-white"
                >
                  <MessageCircle className="h-4 w-4" />
                  {t('product.order')}
                </Button>
              </a>
              <button
                onClick={clearCart}
                className="w-full text-xs font-sans text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider py-2"
              >
                {t('cart.clear')}
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;