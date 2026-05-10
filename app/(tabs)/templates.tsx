import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, FlatList,
  TouchableOpacity, Platform, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { TemplateCard, CARD_W } from '@/components/TemplateCard';
import { MOCK_TEMPLATES, CATEGORIES } from '@/constants/templates';
import { toggleFavorite } from '@/lib/storage';

type SortOption = 'trending' | 'newest' | 'rating' | 'downloads';

const SORT_OPTS: { id: SortOption; label: string }[] = [
  { id: 'trending', label: 'Trending' },
  { id: 'newest',   label: 'New'      },
  { id: 'rating',   label: 'Top Rated'},
  { id: 'downloads',label: 'Popular'  },
];

const ALL_CATS = [{ id: '', name: 'All', icon: 'grid-outline', color: '#C9A84C', count: MOCK_TEMPLATES.length }, ...CATEGORIES];

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

  const templates = useMemo(() => {
    let list = [...MOCK_TEMPLATES];
    if (selectedCategory) list = list.filter(t => t.category === selectedCategory);
    if (showPremiumOnly)  list = list.filter(t => t.isPremium);
    if (sort === 'newest')    list = [...list.filter(t => t.isNew), ...list.filter(t => !t.isNew)];
    else if (sort === 'rating')    list.sort((a, b) => b.rating - a.rating);
    else if (sort === 'downloads') list.sort((a, b) => b.downloads - a.downloads);
    else list = [...list.filter(t => t.isTrending), ...list.filter(t => !t.isTrending)];
    return list;
  }, [selectedCategory, sort, showPremiumOnly]);

  // Split into two columns for masonry
  const leftCol  = templates.filter((_, i) => i % 2 === 0);
  const rightCol = templates.filter((_, i) => i % 2 === 1);

  const handleFavorite = async (id: string) => {
    const added = await toggleFavorite(id);
    if (added) addFavorite(id); else removeFavorite(id);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* ── Sticky Header ── */}
      <View style={[styles.header, { paddingTop: topInset + 10, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.eyebrow, { color: colors.textMuted }]}>DISCOVER</Text>
            <Text style={[styles.title, { color: colors.text }]}>Templates</Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowPremiumOnly(p => !p)}
            style={[
              styles.proBtn,
              {
                backgroundColor: showPremiumOnly ? '#B8860B' : colors.surface,
                borderColor: showPremiumOnly ? '#B8860B' : colors.border,
              },
            ]}
          >
            <Ionicons name="diamond" size={13} color={showPremiumOnly ? '#FAF7F0' : '#B8860B'} />
            <Text style={[styles.proBtnText, { color: showPremiumOnly ? '#FAF7F0' : '#B8860B' }]}>PRO</Text>
          </TouchableOpacity>
        </View>

        {/* Category tab strip */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catStrip}
        >
          {ALL_CATS.map(cat => {
            const active = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.catTab,
                  {
                    backgroundColor: active ? cat.color : colors.surface,
                    borderColor: active ? cat.color : colors.border,
                  },
                ]}
              >
                <Text style={[styles.catTabText, { color: active ? '#FAF7F0' : colors.text }]}>
                  {cat.name}
                </Text>
                <Text style={[styles.catCount, { color: active ? 'rgba(255,255,255,0.75)' : colors.textMuted }]}>
                  {cat.count}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Sort chips */}
        <View style={styles.sortRow}>
          {SORT_OPTS.map(opt => {
            const active = sort === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                onPress={() => setSort(opt.id)}
                style={[
                  styles.sortChip,
                  { backgroundColor: active ? colors.text : 'transparent' },
                ]}
              >
                <Text style={[styles.sortText, { color: active ? colors.background : colors.textSecondary }]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
          <View style={{ flex: 1 }} />
          <Text style={[styles.count, { color: colors.textMuted }]}>{templates.length} designs</Text>
        </View>
      </View>

      {/* ── Masonry Grid ── */}
      <ScrollView
        contentContainerStyle={[styles.grid, { paddingBottom: TAB_H + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.columns}>
          {/* Left column */}
          <View style={styles.col}>
            {leftCol.map((t, i) => (
              <View key={t.id} style={{ marginBottom: 12 }}>
                <TemplateCard
                  template={t}
                  isFavorite={favorites.includes(t.id)}
                  onPress={() => router.push(`/template/${t.id}`)}
                  onFavorite={() => handleFavorite(t.id)}
                  tall={i % 3 === 0}
                />
              </View>
            ))}
          </View>

          {/* Right column — offset top for stagger */}
          <View style={[styles.col, { marginTop: 28 }]}>
            {rightCol.map((t, i) => (
              <View key={t.id} style={{ marginBottom: 12 }}>
                <TemplateCard
                  template={t}
                  isFavorite={favorites.includes(t.id)}
                  onPress={() => router.push(`/template/${t.id}`)}
                  onFavorite={() => handleFavorite(t.id)}
                  tall={i % 3 === 1}
                />
              </View>
            ))}
          </View>
        </View>

        {templates.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={40} color={colors.border} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No templates found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  /* Header */
  header: {
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  eyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 3, marginBottom: 2 },
  title: {
    fontSize: 28,
    fontFamily: 'CormorantGaramond_700Bold',
    letterSpacing: 0.2,
  },
  proBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
  },
  proBtnText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },

  /* Category strip */
  catStrip: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 12,
  },
  catTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  catTabText: { fontSize: 13, fontWeight: '600' },
  catCount: { fontSize: 11 },

  /* Sort */
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 4,
  },
  sortChip: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 20,
  },
  sortText: { fontSize: 12, fontWeight: '600' },
  count: { fontSize: 12 },

  /* Grid */
  grid: { padding: 16 },
  columns: {
    flexDirection: 'row',
    gap: 12,
  },
  col: { flex: 1 },

  /* Empty */
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingTop: 60 },
  emptyText: { fontSize: 15 },
});
