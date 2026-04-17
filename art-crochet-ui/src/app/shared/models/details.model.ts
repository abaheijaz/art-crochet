import { ProductType } from '../services/instagram-pictures.service';

export interface ProductDetail {
  productType: ProductType;
  displayName: string;
  description: string;
  sizes: string[];
  threadUsed: string;
  availableColors: string[];
  timeToMake: string;
  notes?: string;
}

export const PRODUCT_DETAILS_DATA: Partial<Record<ProductType, ProductDetail>> = {
  'teddy-bear': {
    productType: 'teddy-bear',
    displayName: 'Teddy Bear',
    description: 'A classic handmade crochet teddy bear, lovingly crafted with soft yarn.',
    sizes: ['Small (15 cm)', 'Medium (25 cm)', 'Large (35 cm)'],
    threadUsed: 'Cotton blend DK weight',
    availableColors: ['Cream', 'Brown', 'Grey', 'Pink'],
    timeToMake: '4–6 hours',
    notes: 'Placeholder — update with real product details.',
  },
  amigurumi: {
    productType: 'amigurumi',
    displayName: 'Amigurumi',
    description: 'Cute Japanese-style crocheted stuffed characters.',
    sizes: ['Mini (8 cm)', 'Standard (15 cm)'],
    threadUsed: 'Acrylic sport weight',
    availableColors: ['White', 'Yellow', 'Blue', 'Red'],
    timeToMake: '2–4 hours',
    notes: 'Placeholder — update with real product details.',
  },
  bag: {
    productType: 'bag',
    displayName: 'Crochet Bag',
    description: 'Stylish and durable handmade crochet bags perfect for everyday use.',
    sizes: ['Tote (40 × 35 cm)', 'Mini (20 × 18 cm)'],
    threadUsed: 'Cotton aran weight',
    availableColors: ['Natural', 'Terracotta', 'Sage', 'Navy'],
    timeToMake: '6–10 hours',
    notes: 'Placeholder — update with real product details.',
  },
};
