import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, FlatList, Platform, TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { TemplateCard } from '@/components/TemplateCard';
import { CategoryPill } from '@/components/CategoryPill';
import { AIPromptModal } from '@/components/AIPromptModal';
import { MOCK_TEMPLATES, CATEGORIES } from '@/constants/templates';
import { toggleFavorite } from '@/lib/storage';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, favorites, addFavorite, removeFavorite } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAI, setShowAI] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const topInset = Platform.OS === 'web' ? 67 : insets.top;

  const trending = MOCK_TEMPLATES.filter(t => t.isTrending);
  const newTemplates = MOCK_TEMPLATES.filter(t => t.isNew);
  const filtered = selectedCategory
    ? MOCK_TEMPLATES.filter(t => t.category === selectedCategory)
    : MOCK_TEMPLATES;

  const handleFavorite = async (id: string) => {
    const added = await toggleFavorite(id);
    if (added) addFavorite(id);
    else removeFavorite(id);
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const TAB_H = 60 + (Platform.OS === 'web' ? 34 : insets.bottom);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_H + 16 }}
      >
        {/* Hero Header */}
        <LinearGradient colors={['#1C1209', '#2D1E0F', colors.background]} style={[styles.hero, { paddingTop: topInset + 8 }]}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.greeting}>{greeting()}, {user?.name?.split(' ')[0] ?? 'Guest'}</Text>
              <Text style={styles.heroTitle}>Find Your{'\n'}Perfect Invitation</Text>
            </View>
            <TouchableOpacity style={styles.notifBtn}>
              <Ionicons name="notifications-outline" size={22} color="#C9A84C" />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
            <Ionicons name="search-outline" size={18} color={colors.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search templates, categories..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>

        {/* AI Banner */}
        <TouchableOpacity onPress={() => setShowAI(true)} activeOpacity={0.9} style={styles.aiBannerWrap}>
          <LinearGradient colors={['#1A2E5A', '#6B3FA0', '#B8860B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.aiBanner}>
            <View style={styles.aiBannerLeft}>
              <View style={styles.aiIcon}>
                <Ionicons name="sparkles" size={20} color="#FAF7F0" />
              </View>
              <View>
                <Text style={styles.aiBannerTitle}>AI Magic</Text>
                <Text style={styles.aiBannerSub}>Generate from your prompt</Text>
              </View>
            </View>
            <View style={styles.aiBannerRight}>
              <Text style={styles.aiBannerCta}>Try Now</Text>
              <Ionicons name="arrow-forward" size={16} color="#FAF7F0" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesRow} contentContainerStyle={styles.categoriesContent}>
            <TouchableOpacity
              onPress={() => setSelectedCategory('')}
              style={[styles.allPill, { backgroundColor: selectedCategory === '' ? colors.primary : colors.muted, borderColor: selectedCategory === '' ? colors.primary : colors.border }]}
            >
              <Text style={[styles.allPillText, { color: selectedCategory === '' ? '#FAF7F0' : colors.textSecondary }]}>All</Text>
            </TouchableOpacity>
            {CATEGORIES.map(cat => (
              <CategoryPill
                key={cat.id}
                category={cat}
                isSelected={selectedCategory === cat.id}
                onPress={() => setSelectedCategory(selectedCategory === cat.id ? '' : cat.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Trending */}
        {!selectedCategory && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                <Ionicons name="flame" size={18} color="#C0392B" /> Trending
              </Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/templates')}>
                <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendingRow}>
              {trending.map(t => (
                <TemplateCard
                  key={t.id}
                  template={t}
                  isFavorite={favorites.includes(t.id)}
                  onPress={() => router.push(`/template/${t.id}`)}
                  onFavorite={() => handleFavorite(t.id)}
                  size="large"
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* New Arrivals */}
        {!selectedCategory && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                <Ionicons name="sparkles" size={16} color="#C9A84C" /> New Arrivals
              </Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/templates')}>
                <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={newTemplates}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.trendingRow}
              keyExtractor={t => t.id}
              renderItem={({ item }) => (
                <TemplateCard
                  template={item}
                  isFavorite={favorites.includes(item.id)}
                  onPress={() => router.push(`/template/${item.id}`)}
                  onFavorite={() => handleFavorite(item.id)}
                />
              )}
            />
          </View>
        )}

        {/* All / Filtered Templates */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {selectedCategory ? CATEGORIES.find(c => c.id === selectedCategory)?.name : 'All Templates'}
            </Text>
            <Text style={[styles.count, { color: colors.textSecondary }]}>{filtered.length} designs</Text>
          </View>
          <View style={styles.grid}>
            {filtered.map(t => (
              <TemplateCard
                key={t.id}
                template={t}
                isFavorite={favorites.includes(t.id)}
                onPress={() => router.push(`/template/${t.id}`)}
                onFavorite={() => handleFavorite(t.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <AIPromptModal
        visible={showAI}
        onClose={() => setShowAI(false)}
        onGenerate={(prompt, style) => {
          router.push(`/editor/new?prompt=${encodeURIComponent(prompt)}&style=${style}`);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { paddingHorizontal: 20, paddingBottom: 24 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  greeting: { color: 'rgba(201,168,76,0.9)', fontSize: 13, fontWeight: '500', marginBottom: 4 },
  heroTitle: { color: '#FAF7F0', fontSize: 28, fontWeight: '800', letterSpacing: -0.5, lineHeight: 34, fontFamily: 'CormorantGaramond_700Bold' },
  notifBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(201,168,76,0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(201,168,76,0.2)' },
  notifDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#C0392B', borderWidth: 1, borderColor: '#FAF7F0' },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  searchInput: { flex: 1, fontSize: 15 },
  aiBannerWrap: { marginHorizontal: 20, marginTop: 20, borderRadius: 16, overflow: 'hidden', shadowColor: '#6B3FA0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  aiBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  aiBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  aiIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(250,247,240,0.2)', alignItems: 'center', justifyContent: 'center' },
  aiBannerTitle: { color: '#FAF7F0', fontSize: 15, fontWeight: '800' },
  aiBannerSub: { color: 'rgba(250,247,240,0.75)', fontSize: 12 },
  aiBannerRight: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(250,247,240,0.2)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  aiBannerCta: { color: '#FAF7F0', fontSize: 13, fontWeight: '700' },
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  seeAll: { fontSize: 13, fontWeight: '600' },
  count: { fontSize: 13 },
  categoriesRow: { marginHorizontal: -20 },
  categoriesContent: { paddingHorizontal: 20, gap: 8, flexDirection: 'row' },
  allPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  allPillText: { fontSize: 12, fontWeight: '600' },
  trendingRow: { gap: 12, paddingRight: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
});
