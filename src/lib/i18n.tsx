import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'fr' | 'nl';

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    'nav.home': 'الرئيسية',
    'nav.catalog': 'الكتالوج',
    'nav.contact': 'تواصلي معنا',
    'nav.robes': 'روبات',
    'nav.jelbabs': 'جلابيات',
    'nav.complets': 'كومبليات',
    'hero.title': 'أناقتكِ تبدأ من هنا',
    'hero.subtitle': 'اكتشفي تشكيلتنا الجديدة من الملابس النسائية الراقية',
    'hero.cta': 'تصفحي الكتالوج',
    'sections.title': 'أقسامنا',
    'sections.robes': 'روبات',
    'sections.jelbabs': 'جلابيات',
    'sections.complets': 'كومبليات',
    'sections.robes.desc': 'روبات أنيقة بتصاميم عصرية',
    'sections.jelbabs.desc': 'جلابيات مطرزة بلمسة تقليدية',
    'sections.complets.desc': 'كومبليات فاخرة لإطلالة مميزة',
    'featured.title': 'منتجات مميزة',
    'product.size': 'المقاس',
    'product.order': 'اطلبي عبر واتساب',
    'product.price': 'درهم',
    'catalog.title': 'الكتالوج',
    'catalog.all': 'الكل',
    'catalog.filter': 'تصفية حسب القسم',
    'contact.title': 'تواصلي معنا',
    'contact.phone': 'الهاتف',
    'contact.whatsapp': 'واتساب',
    'contact.instagram': 'إنستغرام',
    'contact.form.name': 'الاسم',
    'contact.form.email': 'البريد الإلكتروني',
    'contact.form.message': 'الرسالة',
    'contact.form.send': 'إرسال',
    'footer.rights': 'جميع الحقوق محفوظة',
    'footer.quicklinks': 'روابط سريعة',
    'footer.contact': 'تواصلي معنا',
    'whatsapp.message': 'مرحباً، أريد طلب:',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.catalog': 'Catalogue',
    'nav.contact': 'Contact',
    'nav.robes': 'Robes',
    'nav.jelbabs': 'Jelbabs',
    'nav.complets': 'Complets',
    'hero.title': 'Votre élégance commence ici',
    'hero.subtitle': 'Découvrez notre nouvelle collection de vêtements féminins raffinés',
    'hero.cta': 'Parcourir le catalogue',
    'sections.title': 'Nos Catégories',
    'sections.robes': 'Robes',
    'sections.jelbabs': 'Jelbabs',
    'sections.complets': 'Complets',
    'sections.robes.desc': 'Robes élégantes aux designs modernes',
    'sections.jelbabs.desc': 'Jelbabs brodés avec une touche traditionnelle',
    'sections.complets.desc': 'Complets luxueux pour un look unique',
    'featured.title': 'Produits Vedettes',
    'product.size': 'Taille',
    'product.order': 'Commander via WhatsApp',
    'product.price': 'DH',
    'catalog.title': 'Catalogue',
    'catalog.all': 'Tous',
    'catalog.filter': 'Filtrer par catégorie',
    'contact.title': 'Contactez-nous',
    'contact.phone': 'Téléphone',
    'contact.whatsapp': 'WhatsApp',
    'contact.instagram': 'Instagram',
    'contact.form.name': 'Nom',
    'contact.form.email': 'Email',
    'contact.form.message': 'Message',
    'contact.form.send': 'Envoyer',
    'footer.rights': 'Tous droits réservés',
    'footer.quicklinks': 'Liens rapides',
    'footer.contact': 'Contact',
    'whatsapp.message': 'Bonjour, je souhaite commander:',
  },
  nl: {
    'nav.home': 'Home',
    'nav.catalog': 'Catalogus',
    'nav.contact': 'Contact',
    'nav.robes': 'Jurken',
    'nav.jelbabs': 'Jelbabs',
    'nav.complets': 'Complets',
    'hero.title': 'Uw elegantie begint hier',
    'hero.subtitle': 'Ontdek onze nieuwe collectie verfijnde dameskleding',
    'hero.cta': 'Bekijk de catalogus',
    'sections.title': 'Onze Categorieën',
    'sections.robes': 'Jurken',
    'sections.jelbabs': 'Jelbabs',
    'sections.complets': 'Complets',
    'sections.robes.desc': 'Elegante jurken met moderne designs',
    'sections.jelbabs.desc': 'Geborduurde jelbabs met een traditionele toets',
    'sections.complets.desc': 'Luxueuze complets voor een unieke look',
    'featured.title': 'Uitgelichte Producten',
    'product.size': 'Maat',
    'product.order': 'Bestel via WhatsApp',
    'product.price': 'DH',
    'catalog.title': 'Catalogus',
    'catalog.all': 'Alles',
    'catalog.filter': 'Filteren op categorie',
    'contact.title': 'Neem contact op',
    'contact.phone': 'Telefoon',
    'contact.whatsapp': 'WhatsApp',
    'contact.instagram': 'Instagram',
    'contact.form.name': 'Naam',
    'contact.form.email': 'E-mail',
    'contact.form.message': 'Bericht',
    'contact.form.send': 'Verzenden',
    'footer.rights': 'Alle rechten voorbehouden',
    'footer.quicklinks': 'Snelle links',
    'footer.contact': 'Contact',
    'whatsapp.message': 'Hallo, ik wil graag bestellen:',
  },
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('ar')) return 'ar';
    if (browserLang.startsWith('nl')) return 'nl';
    return 'fr';
  });

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang, dir]);

  const t = (key: string) => translations[lang][key] || key;

  return (
    <I18nContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
};
