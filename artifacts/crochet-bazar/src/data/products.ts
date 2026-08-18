import bouquetImage from '@assets/WhatsApp_Image_2026-08-18_at_4.17.30_PM_1787050107548.jpeg';
import earringsImage from '@assets/WhatsApp_Image_2026-08-18_at_4.17.26_PM_1787050107548.jpeg';
import gajraImage from '@assets/WhatsApp_Image_2026-08-18_at_4.10.56_PM_1787050107549.jpeg';
import roseGajraImage from '@assets/WhatsApp_Image_2026-08-18_at_4.10.55_PM_(1)_1787050107549.jpeg';
import yellowBraceletImage from '@assets/WhatsApp_Image_2026-08-18_at_4.10.55_PM_1787050107550.jpeg';
import redRoseImage from '@assets/WhatsApp_Image_2026-08-18_at_4.10.54_PM_(2)_1787050107550.jpeg';
import yellowRosesImage from '@assets/WhatsApp_Image_2026-08-18_at_4.10.54_PM_(1)_1787050107551.jpeg';
import burgundyRoseImage from '@assets/WhatsApp_Image_2026-08-18_at_4.10.54_PM_1787050107551.jpeg';
import blueFlowerImage from '@assets/WhatsApp_Image_2026-08-18_at_4.10.53_PM_(1)_1787050107552.jpeg';
import roseBouquetImage from '@assets/WhatsApp_Image_2026-08-18_at_4.10.53_PM_1787050107552.jpeg';
import pinkEarringsImage from '@assets/WhatsApp_Image_2026-08-18_at_4.12.52_PM_1787050107552.jpeg';
import sunflowerImage from '@assets/WhatsApp_Image_2026-08-18_at_4.12.53_PM_1787050107553.jpeg';
import tulipImage from '@assets/WhatsApp_Image_2026-08-18_at_4.10.50_PM_1787050107553.jpeg';

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  featured?: boolean;
};

const copy = 'Beautiful handmade crochet piece crafted with care. Perfect for gifting, decoration and special occasions.';

export const products: Product[] = [
  { id: 'crochet-flower', name: 'Crochet Flower', price: 149, category: 'Flowers', image: redRoseImage, description: copy, featured: true },
  { id: 'crochet-gajra', name: 'Crochet Gajra', price: 249, category: 'Gajras', image: gajraImage, description: 'A joyful floral gajra with tiny hand-crocheted blooms and a soft, comfortable tie.', featured: true },
  { id: 'crochet-rose', name: 'Crochet Rose', price: 129, category: 'Roses', image: burgundyRoseImage, description: copy },
  { id: 'blue-crochet-rose', name: 'Blue Crochet Rose', price: 149, category: 'Roses', image: blueFlowerImage, description: copy },
  { id: 'yellow-crochet-flowers', name: 'Yellow Crochet Flowers', price: 179, category: 'Flowers', image: yellowRosesImage, description: 'Sunny yellow roses made to stay bright, season after season.', featured: true },
  { id: 'rose-gajra', name: 'Rose Gajra', price: 299, category: 'Gajras', image: roseGajraImage, description: 'A festive rose and jasmine-inspired wrist gajra with charming dangling details.' },
  { id: 'crochet-sunflower', name: 'Crochet Sunflower', price: 199, category: 'Sunflowers', image: sunflowerImage, description: copy },
  { id: 'big-crochet-gajra', name: 'Big Crochet Gajra', price: 399, category: 'Gajras', image: yellowBraceletImage, description: 'A statement gajra for celebrations, made slowly with bold colour and soft yarn.' },
  { id: 'crochet-earrings', name: 'Crochet Earrings', price: 199, category: 'Earrings', image: earringsImage, description: 'Lightweight, one-of-a-kind crochet earrings finished with delicate pearl details.', featured: true },
  { id: 'crochet-flower-bouquet', name: 'Crochet Flower Bouquet', price: 499, category: 'Bouquets', image: bouquetImage, description: 'A little bouquet that never wilts, wrapped for gifting with all the warmth of a handmade parcel.', featured: true },
  { id: 'crochet-rose-bouquet', name: 'Crochet Rose Bouquet', price: 449, category: 'Bouquets', image: roseBouquetImage, description: copy },
  { id: 'crochet-tulip-bunch', name: 'Crochet Tulip Bunch', price: 349, category: 'Bouquets', image: tulipImage, description: copy },
  { id: 'pink-crochet-earrings', name: 'Pink Crochet Earrings', price: 179, category: 'Earrings', image: pinkEarringsImage, description: copy },
];

export const categories = ['All', 'Flowers', 'Gajras', 'Bouquets', 'Roses', 'Sunflowers', 'Earrings'];
export const WHATSAPP_NUMBER = '916267878947';