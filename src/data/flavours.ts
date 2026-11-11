import type { Flavour } from '../types/cruncha';

export const FLAVOURS: Flavour[] = [
  {
    id: 'fire-chilli',
    name: 'Fire Chilli',
    tagline: 'SMOKY HEAT THAT PACKS A PUNCH',
    description: 'Slow-roasted red habanero and Kashmiri chilli dusted over golden kettle-crisped chips with a hint of smoked paprika and lime zest.',
    primaryColor: '#F04432',
    secondaryColor: '#FF8A37',
    accentColor: '#FFA559',
    heatLevel: 4,
    crunchFactor: 9.8,
    price: 3.49,
    weight: '140g',
    nutrition: {
      calories: 540,
      protein: '6g',
      carbs: '52g',
      fat: '32g',
      sodium: '380mg'
    },
    keyNotes: ['Smoked Paprika', 'Red Habanero', 'Lime Zest', 'Sea Salt'],
    pairing: 'Chilled craft IPA or avocado lime crema dip',
    bgGradient: 'from-[#F04432] via-[#D32F2F] to-[#801313]',
    badge: 'HOTTEST SELLER'
  },
  {
    id: 'sour-cream-onion',
    name: 'Sour Cream & Onion',
    tagline: 'COOL, TANGY & OBSESSIVELY HERBY',
    description: 'Thick-cut potato ridges drenched in cultured French sour cream, fresh garden chives, sweet spring scallions, and toasted shallot powder.',
    primaryColor: '#75A94B',
    secondaryColor: '#D4E8A4',
    accentColor: '#9BC56B',
    heatLevel: 0,
    crunchFactor: 9.5,
    price: 3.49,
    weight: '140g',
    nutrition: {
      calories: 520,
      protein: '7g',
      carbs: '50g',
      fat: '30g',
      sodium: '360mg'
    },
    keyNotes: ['French Sour Cream', 'Spring Scallions', 'Garden Chives', 'Roasted Garlic'],
    pairing: 'Caramelized onion dip or sparkling botanical tonic',
    bgGradient: 'from-[#75A94B] via-[#5D8B38] to-[#2E4F18]',
    badge: 'CROWD FAVORITE'
  },
  {
    id: 'classic-salted',
    name: 'Classic Salted',
    tagline: 'PURE GOLDEN CRUNCH. ZERO COMPROMISE.',
    description: 'Hand-selected organic Russet potatoes, flash-fried in small batches to golden perfection, finished with hand-harvested Himalayan pink crystals.',
    primaryColor: '#F3C94B',
    secondaryColor: '#FFF0A6',
    accentColor: '#FFD768',
    heatLevel: 0,
    crunchFactor: 10.0,
    price: 3.29,
    weight: '140g',
    nutrition: {
      calories: 510,
      protein: '6g',
      carbs: '48g',
      fat: '31g',
      sodium: '310mg'
    },
    keyNotes: ['Pink Rock Salt', 'Golden Russet', 'Cold-Pressed Oil', 'Pure Potato Flavor'],
    pairing: 'Everything. Literally whatever you are drinking right now.',
    bgGradient: 'from-[#F3C94B] via-[#E0B232] to-[#8B6A14]',
    badge: 'ORIGINAL ICON'
  },
  {
    id: 'tangy-masala',
    name: 'Tangy Masala',
    tagline: 'AN EXPLOSION OF 12 STREET-STYLE SPICES',
    description: 'An electrifying collision of sun-dried mango amchur, cumin seed, black salt, coriander, crushed peppercorn, and warm toasted cloves.',
    primaryColor: '#914ACB',
    secondaryColor: '#D5A7F2',
    accentColor: '#B06EE0',
    heatLevel: 3,
    crunchFactor: 9.7,
    price: 3.49,
    weight: '140g',
    nutrition: {
      calories: 530,
      protein: '7g',
      carbs: '51g',
      fat: '31g',
      sodium: '410mg'
    },
    keyNotes: ['Amchur (Dry Mango)', 'Black Salt', 'Toasted Cumin', 'Kala Namak'],
    pairing: 'Sweet mint yoghurt chutney or iced chai',
    bgGradient: 'from-[#914ACB] via-[#7534A8] to-[#401265]',
    badge: 'BOLD & ZESTY'
  },
  {
    id: 'cheese-blast',
    name: 'Cheese Blast',
    tagline: 'MELTED CHEDDAR MADNESS IN EVERY BITE',
    description: 'Triple-aged Wisconsin cheddar layered with aged Gouda and toasted parmesan dusted generously over our thickest undulating wavy chip.',
    primaryColor: '#3988D5',
    secondaryColor: '#A7D8FF',
    accentColor: '#5EA3E6',
    heatLevel: 1,
    crunchFactor: 9.9,
    price: 3.49,
    weight: '140g',
    nutrition: {
      calories: 550,
      protein: '8g',
      carbs: '49g',
      fat: '34g',
      sodium: '390mg'
    },
    keyNotes: ['Aged Cheddar', 'Dutch Gouda', 'Parmesan Dust', 'Smoked Butter'],
    pairing: 'Spicy salsa dip or ice-cold craft cola',
    bgGradient: 'from-[#3988D5] via-[#2A6BAE] to-[#123E6E]',
    badge: 'ULTRA CHEESY'
  }
];

export const FLAVOUR_MAP = FLAVOURS.reduce<Record<string, Flavour>>((acc, f) => {
  acc[f.id] = f;
  return acc;
}, {});
