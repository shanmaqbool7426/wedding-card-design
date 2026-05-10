import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  DESIGNS: 'wedcraft_designs',
  USER: 'wedcraft_user',
  FAVORITES: 'wedcraft_favorites',
  ONBOARDED: 'wedcraft_onboarded',
  THEME: 'wedcraft_theme',
};

export interface Design {
  id: string;
  name: string;
  templateId: string;
  thumbnail: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  data: Record<string, unknown>;
  isPremium: boolean;
}

export async function getDesigns(): Promise<Design[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.DESIGNS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveDesign(design: Design): Promise<void> {
  const designs = await getDesigns();
  const idx = designs.findIndex(d => d.id === design.id);
  if (idx >= 0) {
    designs[idx] = design;
  } else {
    designs.unshift(design);
  }
  await AsyncStorage.setItem(KEYS.DESIGNS, JSON.stringify(designs));
}

export async function deleteDesign(id: string): Promise<void> {
  const designs = await getDesigns();
  const filtered = designs.filter(d => d.id !== id);
  await AsyncStorage.setItem(KEYS.DESIGNS, JSON.stringify(filtered));
}

export async function getFavorites(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.FAVORITES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function toggleFavorite(templateId: string): Promise<boolean> {
  const favorites = await getFavorites();
  const idx = favorites.indexOf(templateId);
  if (idx >= 0) {
    favorites.splice(idx, 1);
  } else {
    favorites.push(templateId);
  }
  await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
  return idx < 0;
}

export async function isOnboarded(): Promise<boolean> {
  const val = await AsyncStorage.getItem(KEYS.ONBOARDED);
  return val === 'true';
}

export async function setOnboarded(): Promise<void> {
  await AsyncStorage.setItem(KEYS.ONBOARDED, 'true');
}

export async function getUser(): Promise<Record<string, string> | null> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function saveUser(user: Record<string, string>): Promise<void> {
  await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
}

export async function clearUser(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.USER);
}
