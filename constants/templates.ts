export interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  isPremium: boolean;
  downloads: number;
  rating: number;
  colors: string[];
  tags: string[];
  isNew?: boolean;
  isTrending?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

export const CATEGORIES: Category[] = [
  { id: 'hindu', name: 'Hindu Wedding', icon: 'flower', color: '#B8860B', count: 245 },
  { id: 'muslim', name: 'Muslim Wedding', icon: 'moon', color: '#1B6B4A', count: 187 },
  { id: 'christian', name: 'Christian Wedding', icon: 'heart', color: '#6B3FA0', count: 163 },
  { id: 'sikh', name: 'Sikh Wedding', icon: 'star', color: '#C0392B', count: 98 },
  { id: 'royal', name: 'Royal Wedding', icon: 'diamond', color: '#C9A84C', count: 134 },
  { id: 'minimal', name: 'Minimal', icon: 'feather', color: '#2D2417', count: 212 },
  { id: 'destination', name: 'Destination', icon: 'map-pin', color: '#1A2E5A', count: 89 },
  { id: 'engagement', name: 'Engagement', icon: 'ring', color: '#E8B4B8', count: 156 },
  { id: 'mehendi', name: 'Mehendi', icon: 'leaf', color: '#2E7D52', count: 74 },
  { id: 'haldi', name: 'Haldi', icon: 'sun', color: '#F0A500', count: 63 },
  { id: 'reception', name: 'Reception', icon: 'music', color: '#7D1935', count: 118 },
  { id: 'birthday', name: 'Birthday', icon: 'gift', color: '#E8A5B0', count: 201 },
  { id: 'anniversary', name: 'Anniversary', icon: 'heart', color: '#C9A84C', count: 143 },
  { id: 'savethedate', name: 'Save The Date', icon: 'calendar', color: '#4A2D72', count: 92 },
];

export const MOCK_TEMPLATES: Template[] = [
  {
    id: '1',
    name: 'Royal Rajasthan',
    category: 'hindu',
    thumbnail: 'template_hindu',
    isPremium: false,
    downloads: 12453,
    rating: 4.9,
    colors: ['#7D1935', '#C9A84C', '#FAF7F0'],
    tags: ['traditional', 'royal', 'hindi'],
    isTrending: true,
  },
  {
    id: '2',
    name: 'Garden Whisper',
    category: 'minimal',
    thumbnail: 'template_modern',
    isPremium: false,
    downloads: 8923,
    rating: 4.8,
    colors: ['#2D2417', '#F2C4CE', '#FAF7F0'],
    tags: ['minimal', 'modern', 'elegant'],
    isNew: true,
  },
  {
    id: '3',
    name: 'Starlit Shores',
    category: 'destination',
    thumbnail: 'template_destination',
    isPremium: true,
    downloads: 6712,
    rating: 4.95,
    colors: ['#1A2E5A', '#C9A84C', '#FAF7F0'],
    tags: ['destination', 'luxury', 'travel'],
    isTrending: true,
  },
  {
    id: '4',
    name: 'Crescent Elegance',
    category: 'muslim',
    thumbnail: 'template_muslim',
    isPremium: true,
    downloads: 5481,
    rating: 4.87,
    colors: ['#1B6B4A', '#C9A84C', '#FAF7F0'],
    tags: ['nikah', 'elegant', 'traditional'],
    isNew: true,
  },
  {
    id: '5',
    name: 'Blush Romance',
    category: 'christian',
    thumbnail: 'template_modern',
    isPremium: false,
    downloads: 9234,
    rating: 4.82,
    colors: ['#6B3FA0', '#F2C4CE', '#FAF7F0'],
    tags: ['romantic', 'western', 'church'],
  },
  {
    id: '6',
    name: 'Golden Mandala',
    category: 'hindu',
    thumbnail: 'template_hindu',
    isPremium: true,
    downloads: 7891,
    rating: 4.93,
    colors: ['#B8860B', '#7D1935', '#FAF7F0'],
    tags: ['mandala', 'gold', 'premium'],
    isTrending: true,
  },
  {
    id: '7',
    name: 'Sage Garden',
    category: 'engagement',
    thumbnail: 'template_modern',
    isPremium: false,
    downloads: 4567,
    rating: 4.75,
    colors: ['#2E7D52', '#E8B4B8', '#FAF7F0'],
    tags: ['botanical', 'engagement', 'garden'],
  },
  {
    id: '8',
    name: 'Midnight Luxury',
    category: 'royal',
    thumbnail: 'template_destination',
    isPremium: true,
    downloads: 11203,
    rating: 4.97,
    colors: ['#1C1209', '#C9A84C', '#FAF7F0'],
    tags: ['luxury', 'black', 'premium', 'royal'],
    isTrending: true,
  },
];

export const AI_STYLES = [
  { id: 'royal', label: 'Royal Indian', gradient: ['#7D1935', '#C9A84C'] },
  { id: 'minimal', label: 'Minimalist', gradient: ['#2D2417', '#8C7B6A'] },
  { id: 'boho', label: 'Bohemian', gradient: ['#2E7D52', '#F0A500'] },
  { id: 'luxury', label: 'Ultra Luxury', gradient: ['#1C1209', '#C9A84C'] },
  { id: 'pastel', label: 'Pastel Dream', gradient: ['#E8B4B8', '#F2C4CE'] },
  { id: 'islamic', label: 'Islamic Art', gradient: ['#1B6B4A', '#C9A84C'] },
];
