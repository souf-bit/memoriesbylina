import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { WHATSAPP_NUMBER } from '@/lib/products';

const Footer = () => {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border/50 bg-secondary/40">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <h3 className="font-serif text-2xl font-semibold tracking-wide mb-4">ÉLÉGANCE</h3>
            <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-xs">
              {t('hero.subtitle')}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-sans uppercase tracking-[0.2em] font-medium mb-6">{t('footer.quicklinks')}</h4>
            <nav className="flex flex-col gap-3" aria-label="Footer navigation">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-light">{t('nav.home')}</Link>
              <Link to="/catalog" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-light">{t('nav.catalog')}</Link>
              <Link to="/catalog?category=robes" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-light">{t('nav.robes')}</Link>
              <Link to="/catalog?category=jelbabs" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-light">{t('nav.jelbabs')}</Link>
              <Link to="/catalog?category=complets" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-light">{t('nav.complets')}</Link>
            </nav>
          </div>

          <div>
            <h4 className="text-xs font-sans uppercase tracking-[0.2em] font-medium mb-6">{t('footer.contact')}</h4>
            <div className="flex flex-col gap-4">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors font-light"
              >
                <MessageCircle className="h-4 w-4" />
                +212 620 198 762
              </a>
              <a
                href="https://www.instagram.com/memories_by_lina?igsh=eTdyNGJlb3V0dXU0&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors font-light"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-border/50 pt-8 text-center">
          <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-muted-foreground">
            © {new Date().getFullYear()} Élégance — {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;