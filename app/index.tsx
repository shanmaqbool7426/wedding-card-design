import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

export default function Index() {
  const { user, hasOnboarded, isLoading } = useApp();
  const router = useRouter();
  const colors = useColors();

  useEffect(() => {
    if (isLoading) return;
    if (!hasOnboarded) {
      router.replace('/onboarding');
    } else if (!user) {
      router.replace('/auth');
    } else {
      router.replace('/(tabs)');
    }
  }, [isLoading, user, hasOnboarded]);

  return <View style={[styles.container, { backgroundColor: colors.background }]} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
