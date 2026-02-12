import robePinkTweed from '@/assets/products/robe-pink-tweed.jpg';
import robeRedTweed from '@/assets/products/robe-red-tweed.jpg';
import jelbabGold from '@/assets/products/jelbab-gold.jpg';
import jelbabWhiteGreen from '@/assets/products/jelbab-white-green.jpg';
import jelbabGreen from '@/assets/products/jelbab-green.jpg';
import completWhiteFur from '@/assets/products/complet-white-fur.jpg';
import completBlackWhite from '@/assets/products/complet-black-white.jpg';
import robePinkTweed2 from '@/assets/products/robe-pink-tweed-2.jpg';
import robeRedTweed2 from '@/assets/products/robe-red-tweed-2.jpg';
import jelbabGold2 from '@/assets/products/jelbab-gold-2.jpg';
import jelbabWhiteGreen2 from '@/assets/products/jelbab-white-green-2.jpg';
import jelbabGreen2 from '@/assets/products/jelbab-green-2.jpg';
import completWhiteFur2 from '@/assets/products/complet-white-fur-2.jpg';
import completBlackWhite2 from '@/assets/products/complet-black-white-2.jpg';

export type Category = 'robes' | 'jelbabs' | 'complets';

export interface Product {
  id: string;
  name: { ar: string; fr: string; nl: string };
  description: { ar: string; fr: string; nl: string };
  category: Category;
  price: number;
  sizes: string[];
  image: string;
}

export const products: Product[] = [
  {
    id: 'robe-pink-tweed',
    name: { ar: 'روب زهري تويد', fr: 'Robe Rose Tweed', nl: 'Roze Tweed Jurk' },
    description: { ar: 'روب أنيق من قماش التويد الزهري بتصميم عصري وراقي', fr: 'Robe élégante en tweed rose au design moderne et raffiné', nl: 'Elegante roze tweed jurk met modern en verfijnd ontwerp' },
    category: 'robes',
    price: 399,
    sizes: ['S', 'M', 'XL'],
    image: robePinkTweed,
  },
  {
    id: 'robe-red-tweed',
    name: { ar: 'روب أحمر تويد', fr: 'Robe Rouge Tweed', nl: 'Rode Tweed Jurk' },
    description: { ar: 'روب فاخر من التويد الأحمر بقصة كلاسيكية', fr: 'Robe luxueuse en tweed rouge à coupe classique', nl: 'Luxueuze rode tweed jurk met klassieke snit' },
    category: 'robes',
    price: 399,
    sizes: ['S', 'M', 'XL'],
    image: robeRedTweed,
  },
  {
    id: 'robe-pink-blazer',
    name: { ar: 'بلايزر زهري تويد فاخر', fr: 'Blazer Rose Tweed Luxe', nl: 'Roze Tweed Blazer Luxe' },
    description: { ar: 'بلايزر أنيق من التويد الزهري مع تفاصيل ذهبية وأزرار لؤلؤية، مثالي للمناسبات الراقية', fr: 'Blazer élégant en tweed rose avec détails dorés et boutons nacrés, parfait pour les occasions chics', nl: 'Elegante roze tweed blazer met gouden details en parelmoeren knopen, perfect voor chique gelegenheden' },
    category: 'robes',
    price: 449,
    sizes: ['S', 'M', 'L', 'XL'],
    image: robePinkTweed2,
  },
  {
    id: 'robe-red-chic',
    name: { ar: 'فستان أحمر شيك', fr: 'Robe Rouge Chic', nl: 'Rode Chique Jurk' },
    description: { ar: 'فستان تويد أحمر فاخر بياقة كلاسيكية وجيوب أمامية، أناقة لا مثيل لها مع إكسسوارات ذهبية', fr: 'Robe en tweed rouge luxueuse avec col classique et poches avant, élégance incomparable avec accessoires dorés', nl: 'Luxueuze rode tweed jurk met klassieke kraag en voorvakken, ongeëvenaarde elegantie met gouden accessoires' },
    category: 'robes',
    price: 469,
    sizes: ['S', 'M', 'L', 'XL'],
    image: robeRedTweed2,
  },
  {
    id: 'jelbab-gold',
    name: { ar: 'جلباب ذهبي مطرز', fr: 'Jelbab Doré Brodé', nl: 'Gouden Geborduurde Jelbab' },
    description: { ar: 'جلباب فاخر بتطريز ذهبي يدوي رائع', fr: 'Jelbab luxueux avec broderie dorée artisanale', nl: 'Luxueuze jelbab met ambachtelijk goudkleurig borduurwerk' },
    category: 'jelbabs',
    price: 355,
    sizes: ['S', 'M', 'XL'],
    image: jelbabGold,
  },
  {
    id: 'jelbab-white-green',
    name: { ar: 'جلباب أبيض وأخضر', fr: 'Jelbab Blanc et Vert', nl: 'Wit-Groene Jelbab' },
    description: { ar: 'جلباب أبيض بزخارف خضراء أنيقة', fr: 'Jelbab blanc avec motifs verts élégants', nl: 'Witte jelbab met elegante groene motieven' },
    category: 'jelbabs',
    price: 355,
    sizes: ['S', 'M', 'XL'],
    image: jelbabWhiteGreen,
  },
  {
    id: 'jelbab-green',
    name: { ar: 'جلباب أخضر', fr: 'Jelbab Vert', nl: 'Groene Jelbab' },
    description: { ar: 'جلباب أخضر فاخر بتصميم تقليدي عصري', fr: 'Jelbab vert luxueux au design traditionnel moderne', nl: 'Luxueuze groene jelbab met modern traditioneel ontwerp' },
    category: 'jelbabs',
    price: 355,
    sizes: ['S', 'M', 'XL'],
    image: jelbabGreen,
  },
  {
    id: 'jelbab-gold-royal',
    name: { ar: 'جلباب ذهبي ملكي', fr: 'Jelbab Doré Royal', nl: 'Koninklijke Gouden Jelbab' },
    description: { ar: 'جلباب ملكي بنقوش ذهبية فاخرة وتطريز يدوي دقيق مع أكمام واسعة وياقة مزخرفة', fr: 'Jelbab royal aux motifs dorés luxueux et broderie artisanale avec manches larges et col orné', nl: 'Koninklijke jelbab met luxueuze gouden motieven en ambachtelijk borduurwerk, wijde mouwen en versierde kraag' },
    category: 'jelbabs',
    price: 499,
    sizes: ['S', 'M', 'L', 'XL'],
    image: jelbabGold2,
  },
  {
    id: 'jelbab-white-sage',
    name: { ar: 'جلباب أبيض وأخضر فاتح', fr: 'Jelbab Blanc et Vert Sauge', nl: 'Wit-Saliegroen Jelbab' },
    description: { ar: 'جلباب أبيض ناعم بلمسات خضراء فاتحة وتطريز تقليدي أنيق، مثالي للإطلالات اليومية الراقية', fr: 'Jelbab blanc doux avec touches vert sauge et broderie traditionnelle, idéal pour un look quotidien raffiné', nl: 'Zachte witte jelbab met saliegroene accenten en traditioneel borduurwerk, ideaal voor een verfijnde dagelijkse look' },
    category: 'jelbabs',
    price: 385,
    sizes: ['S', 'M', 'L', 'XL'],
    image: jelbabWhiteGreen2,
  },
  {
    id: 'jelbab-sage-green',
    name: { ar: 'جلباب أخضر زيتي', fr: 'Jelbab Vert Olive', nl: 'Olijfgroene Jelbab' },
    description: { ar: 'جلباب أخضر زيتي أنيق بقماش فاخر وأكمام واسعة مع تفاصيل تقليدية مميزة', fr: 'Jelbab vert olive élégant en tissu luxueux avec manches larges et détails traditionnels distinctifs', nl: 'Elegante olijfgroene jelbab in luxueuze stof met wijde mouwen en onderscheidende traditionele details' },
    category: 'jelbabs',
    price: 375,
    sizes: ['S', 'M', 'L', 'XL'],
    image: jelbabGreen2,
  },
  {
    id: 'complet-white-fur',
    name: { ar: 'كومبلي أبيض فرو', fr: 'Complet Blanc Fourrure', nl: 'Wit Complet met Bont' },
    description: { ar: 'كومبلي أبيض فاخر بتفاصيل الفرو الأنيقة', fr: 'Complet blanc luxueux avec détails en fourrure', nl: 'Luxueus wit complet met elegante bontdetails' },
    category: 'complets',
    price: 699,
    sizes: ['S', 'M', 'XL'],
    image: completWhiteFur,
  },
  {
    id: 'complet-black-white',
    name: { ar: 'كومبلي أبيض وأسود', fr: 'Complet Noir et Blanc', nl: 'Zwart-Wit Complet' },
    description: { ar: 'كومبلي أنيق بمزيج الأبيض والأسود الكلاسيكي', fr: 'Complet élégant en noir et blanc classique', nl: 'Elegant complet in klassiek zwart-wit' },
    category: 'complets',
    price: 699,
    sizes: ['S', 'M', 'XL'],
    image: completBlackWhite,
  },
  {
    id: 'complet-white-pearl',
    name: { ar: 'كومبلي أبيض لؤلؤي', fr: 'Complet Blanc Perle', nl: 'Parelwit Complet' },
    description: { ar: 'كومبلي أبيض فاخر مع تفاصيل فرو ناعمة وأزرار لؤلؤية، تصميم شتوي أنيق مع بيريه مطابق', fr: 'Complet blanc luxueux avec détails en fourrure douce et boutons nacrés, design hivernal chic avec béret assorti', nl: 'Luxueus wit complet met zachte bontdetails en parelmoeren knopen, chic winterontwerp met bijpassende baret' },
    category: 'complets',
    price: 749,
    sizes: ['S', 'M', 'L', 'XL'],
    image: completWhiteFur2,
  },
  {
    id: 'complet-noir-chanel',
    name: { ar: 'كومبلي أبيض وأسود شانيل', fr: 'Complet Noir & Blanc Chanel', nl: 'Zwart-Wit Chanel Complet' },
    description: { ar: 'كومبلي فاخر بتصميم شانيل الكلاسيكي مع أزرار كريستالية وتفاصيل كشكش أنيقة', fr: 'Complet luxueux au design Chanel classique avec boutons en cristal et détails de volants élégants', nl: 'Luxueus complet met klassiek Chanel-ontwerp, kristallen knopen en elegante ruche-details' },
    category: 'complets',
    price: 799,
    sizes: ['S', 'M', 'L', 'XL'],
    image: completBlackWhite2,
  },
];

export const WHATSAPP_NUMBER = '212620198762';

export const getWhatsAppLink = (productName: string, size: string, price: number, lang: 'ar' | 'fr' | 'nl') => {
  const message = lang === 'ar'
    ? `مرحباً، أريد طلب: ${productName} - المقاس: ${size} - الثمن: ${price} درهم`
    : lang === 'nl'
    ? `Hallo, ik wil graag bestellen: ${productName} - Maat: ${size} - Prijs: ${price} DH`
    : `Bonjour, je souhaite commander: ${productName} - Taille: ${size} - Prix: ${price} DH`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export const getWhatsAppCartLink = (items: CartItem[], lang: 'ar' | 'fr' | 'nl') => {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const lines = items.map((item) =>
    lang === 'ar'
      ? `• ${item.product.name.ar} - المقاس: ${item.size} - الكمية: ${item.quantity} - ${item.product.price * item.quantity} درهم`
      : lang === 'nl'
      ? `• ${item.product.name.nl} - Maat: ${item.size} - Aantal: ${item.quantity} - ${item.product.price * item.quantity} DH`
      : `• ${item.product.name.fr} - Taille: ${item.size} - Qté: ${item.quantity} - ${item.product.price * item.quantity} DH`
  );
  const header = lang === 'ar' ? 'مرحباً، أريد طلب:' : lang === 'nl' ? 'Hallo, ik wil graag bestellen:' : 'Bonjour, je souhaite commander:';
  const totalLine = lang === 'ar' ? `المجموع: ${total} درهم` : `Total: ${total} DH`;
  const message = `${header}\n${lines.join('\n')}\n\n${totalLine}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};
