import { useState } from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { WHATSAPP_NUMBER } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const Contact = () => {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main className="container py-10">
      <h1 className="font-serif text-3xl font-bold mb-8">{t('contact.title')}</h1>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-xl border p-5 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(142,70%,45%)] text-white">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold">{t('contact.whatsapp')}</p>
              <p className="text-sm text-muted-foreground">0620198762</p>
            </div>
          </a>

          <a
            href="tel:+212620198762"
            className="flex items-center gap-4 rounded-xl border p-5 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold">{t('contact.phone')}</p>
              <p className="text-sm text-muted-foreground">0620198762</p>
            </div>
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-xl border p-5 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(330,80%,55%)] to-[hsl(40,90%,55%)] text-white">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </div>
            <div>
              <p className="font-semibold">{t('contact.instagram')}</p>
              <p className="text-sm text-muted-foreground">@elegance</p>
            </div>
          </a>
        </div>

        <div>
          {sent ? (
            <div className="rounded-xl border bg-secondary/30 p-10 text-center">
              <p className="text-lg font-semibold">✅ {t('contact.form.send')}!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">{t('contact.form.name')}</label>
                <Input required className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">{t('contact.form.email')}</label>
                <Input type="email" required className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">{t('contact.form.message')}</label>
                <Textarea required rows={5} className="mt-1" />
              </div>
              <Button type="submit" className="w-full rounded-full">
                {t('contact.form.send')}
              </Button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
};

export default Contact;
