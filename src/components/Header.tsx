import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Globe, ShoppingBag } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useCart } from '@/lib/cart';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

const Header = () => {
  const { lang, setLang, t } = useI18n();
  const { totalItems, setIsOpen } = useCart();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/catalog', label: t('nav.catalog') },
    { to: '/contact', label: t('nav.contact') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/30">
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex flex-col items-center">
          <span className="font-serif text-3xl font-semibold tracking-wide text-foreground">
            ÉLÉGANCE
          </span>
          <span className="text-[10px] font-sans uppercase tracking-[0.35em] text-muted-foreground mt-[-2px]">
            Collection Femme
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-xs font-sans font-medium uppercase tracking-[0.15em] transition-colors hover:text-primary ${
                isActive(link.to)
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLang(lang === 'ar' ? 'fr' : 'ar')}
            className="gap-1.5 text-xs font-sans uppercase tracking-wider"
          >
            <Globe className="h-3.5 w-3.5" />
            {lang === 'ar' ? 'FR' : 'عربي'}
          </Button>

          {/* Cart button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(true)}
            className="relative"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -end-1 bg-primary text-primary-foreground text-[10px] font-sans font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Button>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side={lang === 'ar' ? 'right' : 'left'} className="w-72">
              <SheetTitle className="font-serif text-2xl tracking-wide">ÉLÉGANCE</SheetTitle>
              <nav className="mt-10 flex flex-col gap-6">
                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={`text-sm font-sans font-medium uppercase tracking-[0.15em] transition-colors hover:text-primary ${
                      isActive(link.to) ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
