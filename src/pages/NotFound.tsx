import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const { t } = useI18n();

  return (
    <main className="container flex flex-col items-center justify-center py-32 text-center">
      <p className="font-serif text-8xl font-semibold text-muted-foreground/30">404</p>
      <h1 className="mt-6 font-serif text-3xl font-semibold">{t('notfound.title')}</h1>
      <p className="mt-3 text-muted-foreground font-light max-w-md">{t('notfound.message')}</p>
      <Button asChild variant="outline" className="mt-8 rounded-none px-10 py-5 text-xs uppercase tracking-[0.2em] font-sans font-medium border-foreground text-foreground hover:bg-foreground hover:text-background">
        <Link to="/">{t('notfound.back')}</Link>
      </Button>
    </main>
  );
};

export default NotFound;