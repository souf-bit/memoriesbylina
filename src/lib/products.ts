import robePinkTweed from '@/assets/products/robe-pink-tweed.jpg';
import robeRedTweed from '@/assets/products/robe-red-tweed.jpg';
import jelbabGold from '@/assets/products/jelbab-gold.jpg';
import jelbabWhiteGreen from '@/assets/products/jelbab-white-green.jpg';
import jelbabGreen from '@/assets/products/jelbab-green.jpg';
import completWhiteFur from '@/assets/products/complet-white-fur.jpg';
import completBlackWhite from '@/assets/products/complet-black-white.jpg';

export type Category = 'robes' | 'jelbabs' | 'complets';

export interface Product {
  id: string;
  name: { ar: string; fr: string };
  description: { ar: string; fr: string };
  category: Category;
  price: number;
  sizes: string[];
  image: string;
}

export const products: Product[] = [
  {
    id: 'robe-pink-tweed',
    name: { ar: 'روب زهري تويد', fr: 'Robe Rose Tweed' },
    description: { ar: 'روب أنيق من قماش التويد الزهري بتصميم عصري وراقي', fr: 'Robe élégante en tweed rose au design moderne et raffiné' },
    category: 'robes',
    price: 399,
    sizes: ['S', 'M', 'XL'],
    image: robePinkTweed,
  },
  {
    id: 'robe-red-tweed',
    name: { ar: 'روب أحمر تويد', fr: 'Robe Rouge Tweed' },
    description: { ar: 'روب فاخر من التويد الأحمر بقصة كلاسيكية', fr: 'Robe luxueuse en tweed rouge à coupe classique' },
    category: 'robes',
    price: 399,
    sizes: ['S', 'M', 'XL'],
    image: robeRedTweed,
  },
  {
    id: 'jelbab-gold',
    name: { ar: 'جلباب ذهبي مطرز', fr: 'Jelbab Doré Brodé' },
    description: { ar: 'جلباب فاخر بتطريز ذهبي يدوي رائع', fr: 'Jelbab luxueux avec broderie dorée artisanale' },
    category: 'jelbabs',
    price: 355,
    sizes: ['S', 'M', 'XL'],
    image: jelbabGold,
  },
  {
    id: 'jelbab-white-green',
    name: { ar: 'جلباب أبيض وأخضر', fr: 'Jelbab Blanc et Vert' },
    description: { ar: 'جلباب أبيض بزخارف خضراء أنيقة', fr: 'Jelbab blanc avec motifs verts élégants' },
    category: 'jelbabs',
    price: 355,
    sizes: ['S', 'M', 'XL'],
    image: jelbabWhiteGreen,
  },
  {
    id: 'jelbab-green',
    name: { ar: 'جلباب أخضر', fr: 'Jelbab Vert' },
    description: { ar: 'جلباب أخضر فاخر بتصميم تقليدي عصري', fr: 'Jelbab vert luxueux au design traditionnel moderne' },
    category: 'jelbabs',
    price: 355,
    sizes: ['S', 'M', 'XL'],
    image: jelbabGreen,
  },
  {
    id: 'complet-white-fur',
    name: { ar: 'كومبلي أبيض فرو', fr: 'Complet Blanc Fourrure' },
    description: { ar: 'كومبلي أبيض فاخر بتفاصيل الفرو الأنيقة', fr: 'Complet blanc luxueux avec détails en fourrure' },
    category: 'complets',
    price: 699,
    sizes: ['S', 'M', 'XL'],
    image: completWhiteFur,
  },
  {
    id: 'complet-black-white',
    name: { ar: 'كومبلي أبيض وأسود', fr: 'Complet Noir et Blanc' },
    description: { ar: 'كومبلي أنيق بمزيج الأبيض والأسود الكلاسيكي', fr: 'Complet élégant en noir et blanc classique' },
    category: 'complets',
    price: 699,
    sizes: ['S', 'M', 'XL'],
    image: completBlackWhite,
  },
];

export const WHATSAPP_NUMBER = '212620198762';

export const getWhatsAppLink = (productName: string, size: string, price: number, lang: 'ar' | 'fr') => {
  const message = lang === 'ar'
    ? `مرحباً، أريد طلب: ${productName} - المقاس: ${size} - الثمن: ${price} درهم`
    : `Bonjour, je souhaite commander: ${productName} - Taille: ${size} - Prix: ${price} DH`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};
