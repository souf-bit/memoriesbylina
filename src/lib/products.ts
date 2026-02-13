export type Category = 'robes' | 'jelbabs' | 'complets';

export interface Product {
  id: string;
  name: { ar: string; fr: string; nl: string };
  description: { ar: string; fr: string; nl: string };
  category: Category;
  price: number;
  sizes: string[];
  image: string;
  isFeatured?: boolean;
  stockQty: number;
}

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
