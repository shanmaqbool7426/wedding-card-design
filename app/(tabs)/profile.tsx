import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';

interface MenuItem {
  icon: 'heart' | 'cloud-upload' | 'notifications' | 'language' | 'color-palette' | 'shield' | 'help-circle' | 'star' | 'log-out';
  label: string;
  sublabel?: string;
  action: () => void;
  isDestructive?: boolean;
  badge?: string;
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout, designs, favorites, isPremium } = useApp();

  const topInset = Platform.OS === 'web' ? 67 : insets.top;
  const TAB_H = 60 + (Platform.OS === 'web' ? 34 : insets.bottom);

  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => { await logout(); router.replace('/auth'); } },
    ]);
  };

  const MENU_ITEMS: MenuItem[] = [
    { icon: 'heart', label: 'Saved Templates', sublabel: `${favorites.length} saved`, action: () => {} },
    { icon: 'cloud-upload', label: 'Cloud Backup', sublabel: 'Auto-sync enabled', action: () => {} },
    { icon: 'notifications', label: 'Notifications', action: () => {} },
    { icon: 'language', label: 'Language', sublabel: 'English', action: () => {} },
    { icon: 'color-palette', label: 'App Theme', action: () => {} },
    { icon: 'shield', label: 'Privacy & Security', action: () => {} },
    { icon: 'help-circle', label: 'Help & Support', action: () => {} },
    { icon: 'star', label: 'Rate WedCraft', action: () => {}, badge: '⭐' },
    { icon: 'log-out', label: 'Sign Out', action: handleLogout, isDestructive: true },
  ];

  const stats = [
    { label: 'Designs', value: designs.length.toString() },
    { label: 'Favorites', value: favorites.length.toString() },
    { label: 'Shared', value: '0' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: TAB_H + 16 }}>
        <LinearGradient colors={['#1C1209', '#2D1E0F', colors.background]} style={[styles.hero, { paddingTop: topInset + 16 }]}>
          <View style={styles.avatarWrap}>
            <LinearGradient colors={['#D4A84C', '#B8860B']} style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase() ?? 'G'}</Text>
            </LinearGradient>
            {isPremium && (
              <View style={styles.premiumBadge}>
                <Ionicons name="diamond" size={10} color="#FAF7F0" />
              </View>
            )}
          </View>
          <Text style={styles.name}>{user?.name ?? 'Guest User'}</Text>
          <Text style={styles.email}>{user?.email || 'Guest Mode'}</Text>

          <View style={styles.statsRow}>
            {stats.map((s, i) => (
              <React.Fragment key={s.label}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
                {i < stats.length - 1 && <View style={styles.statDivider} />}
              </React.Fragment>
            ))}
          </View>
        </LinearGradient>

        {!isPremium && (
          <TouchableOpacity activeOpacity={0.88} style={styles.proBannerWrap}>
            <LinearGradient colors={['#7D1935', '#C9A84C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.proBanner}>
              <View>
                <Text style={styles.proTitle}>Upgrade to WedCraft Pro</Text>
                <Text style={styles.proSub}>Unlock unlimited exports, AI styles & premium templates</Text>
              </View>
              <View style={styles.proCta}>
                <Ionicons name="diamond" size={14} color="#FAF7F0" />
                <Text style={styles.proCtaText}>Pro</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <View style={[styles.menuCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              onPress={item.action}
              style={[
                styles.menuItem,
                i < MENU_ITEMS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
              ]}
              activeOpacity={0.75}
            >
              <View style={[styles.menuIconWrap, { backgroundColor: item.isDestructive ? `${colors.error}15` : colors.muted }]}>
                <Ionicons name={item.icon} size={18} color={item.isDestructive ? colors.error : colors.primary} />
              </View>
              <View style={styles.menuText}>
                <Text style={[styles.menuLabel, { color: item.isDestructive ? colors.error : colors.text }]}>{item.label}</Text>
                {item.sublabel && <Text style={[styles.menuSub, { color: colors.textMuted }]}>{item.sublabel}</Text>}
              </View>
              {item.badge ? (
                <Text style={styles.menuBadge}>{item.badge}</Text>
              ) : (
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.version, { color: colors.textMuted }]}>WedCraft v1.0.0 • Made with ❤️</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { paddingHorizontal: 20, paddingBottom: 32, alignItems: 'center' },
  avatarWrap: { marginBottom: 16, position: 'relative' },
  avatar: { width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'rgba(201,168,76,0.4)' },
  avatarText: { color: '#FAF7F0', fontSize: 36, fontWeight: '800', fontFamily: 'CormorantGaramond_700Bold' },
  premiumBadge: { position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: 12, backgroundColor: '#B8860B', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FAF7F0' },
  name: { color: '#FAF7F0', fontSize: 22, fontWeight: '800', fontFamily: 'CormorantGaramond_700Bold' },
  email: { color: 'rgba(250,247,240,0.65)', fontSize: 14, marginTop: 2, marginBottom: 24 },
  statsRow: { flexDirection: 'row', backgroundColor: 'rgba(201,168,76,0.1)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(201,168,76,0.2)', overflow: 'hidden', width: '100%' },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  statValue: { color: '#C9A84C', fontSize: 22, fontWeight: '800' },
  statLabel: { color: 'rgba(250,247,240,0.65)', fontSize: 11, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: 'rgba(201,168,76,0.2)', marginVertical: 10 },
  proBannerWrap: { marginHorizontal: 20, marginTop: 20, borderRadius: 16, overflow: 'hidden' },
  proBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18 },
  proTitle: { color: '#FAF7F0', fontSize: 15, fontWeight: '800', marginBottom: 2 },
  proSub: { color: 'rgba(250,247,240,0.8)', fontSize: 12, maxWidth: 220 },
  proCta: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(250,247,240,0.2)', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20 },
  proCtaText: { color: '#FAF7F0', fontSize: 13, fontWeight: '800' },
  menuCard: { marginHorizontal: 20, marginTop: 24, borderRadius: 20, borderWidth: 1, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  menuIconWrap: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  menuText: { flex: 1, gap: 1 },
  menuLabel: { fontSize: 15, fontWeight: '600' },
  menuSub: { fontSize: 12 },
  menuBadge: { fontSize: 16 },
  version: { textAlign: 'center', fontSize: 12, marginTop: 24, marginBottom: 8 },
});
