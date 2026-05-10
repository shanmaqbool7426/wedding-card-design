import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Design, getDesigns, getFavorites, getUser, saveUser, clearUser, setOnboarded, isOnboarded } from '@/lib/storage';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isPremium: boolean;
}

interface AppContextValue {
  user: User | null;
  designs: Design[];
  favorites: string[];
  hasOnboarded: boolean;
  isLoading: boolean;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => Promise<void>;
  refreshDesigns: () => Promise<void>;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  completeOnboarding: () => Promise<void>;
  isPremium: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const [savedUser, savedDesigns, savedFavorites, onboarded] = await Promise.all([
          getUser(),
          getDesigns(),
          getFavorites(),
          isOnboarded(),
        ]);
        if (savedUser) {
          setUser(savedUser as unknown as User);
        }
        setDesigns(savedDesigns);
        setFavorites(savedFavorites);
        setHasOnboarded(onboarded);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const login = useCallback(async (userData: User) => {
    setUser(userData);
    await saveUser(userData as unknown as Record<string, string>);
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await clearUser();
  }, []);

  const continueAsGuest = useCallback(async () => {
    const guestUser: User = {
      id: 'guest_' + Date.now(),
      name: 'Guest User',
      email: '',
      isPremium: false,
    };
    setUser(guestUser);
  }, []);

  const refreshDesigns = useCallback(async () => {
    const saved = await getDesigns();
    setDesigns(saved);
  }, []);

  const addFavorite = useCallback((id: string) => {
    setFavorites(prev => [...prev, id]);
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites(prev => prev.filter(f => f !== id));
  }, []);

  const completeOnboarding = useCallback(async () => {
    setHasOnboarded(true);
    await setOnboarded();
  }, []);

  const isPremium = user?.isPremium ?? false;

  return (
    <AppContext.Provider value={{
      user,
      designs,
      favorites,
      hasOnboarded,
      isLoading,
      login,
      logout,
      continueAsGuest,
      refreshDesigns,
      addFavorite,
      removeFavorite,
      completeOnboarding,
      isPremium,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
