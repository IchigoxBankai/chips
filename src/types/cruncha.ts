export type FlavourId = 'fire-chilli' | 'sour-cream-onion' | 'classic-salted' | 'tangy-masala' | 'cheese-blast';

export interface Flavour {
  id: FlavourId;
  name: string;
  tagline: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  heatLevel: number; // 0 to 5
  crunchFactor: number; // 1 to 10
  price: number;
  weight: string;
  nutrition: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
    sodium: string;
  };
  keyNotes: string[];
  pairing: string;
  bgGradient: string;
  badge: string;
}

export interface CartItem {
  flavourId: FlavourId;
  name: string;
  price: number;
  quantity: number;
  weight: string;
  primaryColor: string;
}

export interface CustomBoxItem {
  flavourId: FlavourId;
  quantity: number;
}

