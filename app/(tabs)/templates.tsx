import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { TemplateCard } from '@/components/TemplateCard';
import { CategoryGrid } from '@/components/CategoryPill';
import { MOCK_TEMPLATES, CATEGORIES } from '@/constants/templates';
import { toggleFavorite } from '@/lib/storage';

type SortOption = 'trending' | 'newest' | 'rating' | 'downloads';

const SORT_OPTS: { id: SortOption; label: string }[] = [
  { id: 'trending', label: 'Trending' },
  { id: 'newest', label: 'Newest' },
  { id: 'rating', label: 'Top Rated' },
  { id: 'downloads', label: 'Popular' },
];

export default function TemplatesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { favorites, addFavorite, removeFavorite } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sort, setSort] = useState<SortOption>('trending');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  const topInset = Platform.OS === 'web' ? 67 : insets.top;
  const TAB_H = 60 + (Platform.OS === 'web' ? 34 : insets.bottom);

  let templates = [...MOCK_TEMPLATES];
  if (selectedCategory) templates = templates.filter(t => t.category === selectedCategory);
  if (showPremiumOnly) templates = templates.filter(t => t.isPremium);
  if (sort === 'newest') templates = templates.filter(t => t.isNew).concat(templates.filter(t => !t.isNew));
  else if (sort === 'rating') templates.sort((a, b) => b.rating - a.rating);
  else if (sort === 'downloads') templates.sort((a, b) => b.downloads - a.downloads);
  else templates = templates.filter(t => t.isTrending).concat(templates.filter(t => !t.isTrending));

  const handleFavorite = async (id: string) => {
    const added = await toggleFavorite(id);
    if (added) addFavorite(id);
    else removeFavorite(id);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topInset + 8, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Templates</Text>
        <TouchableOpacity
          onPress={() => setShowPremiumOnly(p => !p)}
          style={[styles.filterBtn, { backgroundColor: showPremiumOnly ? colors.primary : colors.muted, borderColor: colors.border }]}
        >
          <Ionicons name="diamond" size={14} color={showPremiumOnly ? '#FAF7F0' : colors.primary} />
          <Text style={[styles.filterText, { color: showPremiumOnly ? '#FAF7F0' : colors.primary }]}>Premium</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={templates}
        keyExtractor={t => t.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ padding: 16, paddingBottom: TAB_H + 16, gap: 12 }}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <View style={styles.sortRow}>
              {SORT_OPTS.map(opt => (
                <TouchableOpacity
                  key={opt.id}
                  onPress={() => setSort(opt.id)}
                  style={[styles.sortChip, { backgroundColor: sort === opt.id ? colors.primary : colors.muted, borderColor: colors.border }]}
                >
                  <Text style={[styles.sortText, { color: sort === opt.id ? '#FAF7F0' : colors.textSecondary }]}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.categorySection}>
              <Text style={[styles.catLabel, { color: colors.textSecondary }]}>Filter by Type</Text>
              <CategoryGrid
                categories={CATEGORIES}
                selected={selectedCategory}
                onSelect={id => setSelectedCategory(selectedCategory === id ? '' : id)}
              />
            </View>
            <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>{templates.length} designs found</Text>
          </View>
        }
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 14, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', borderBottomWidth: 1 },
  title: { fontSize: 28, fontWeight: '800', fontFamily: 'CormorantGaramond_700Bold' },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 },
  filterText: { fontSize: 13, fontWeight: '700' },
  listHeader: { gap: 16, marginBottom: 8 },
  sortRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  sortChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  sortText: { fontSize: 13, fontWeight: '600' },
  categorySection: { gap: 10 },
  catLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  resultsCount: { fontSize: 13 },
  row: { gap: 12 },
});
