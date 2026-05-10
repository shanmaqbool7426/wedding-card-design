import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, ImageBackground, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { MOCK_TEMPLATES } from '@/constants/templates';
import { TEMPLATE_IMAGES } from '@/lib/assets';
import { toggleFavorite, saveDesign } from '@/lib/storage';
import { GoldButton } from '@/components/GoldButton';

const { width, height } = Dimensions.get('window');

export default function TemplateDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { favorites, addFavorite, removeFavorite, isPremium } = useApp();

  const template = MOCK_TEMPLATES.find(t => t.id === id);
  const [isFav, setIsFav] = useState(favorites.includes(id ?? ''));
  const [loading, setLoading] = useState(false);

  const bottomInset = Platform.OS === 'web' ? 34 : insets.bottom;

  if (!template) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Template not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: colors.primary, marginTop: 10 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const imgSource = TEMPLATE_IMAGES[template.thumbnail] ?? TEMPLATE_IMAGES['template_modern'];

  const handleFav = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const added = await toggleFavorite(template.id);
    setIsFav(added);
    if (added) addFavorite(template.id);
    else removeFavorite(template.id);
  };

  const handleUseTemplate = async () => {
    if (template.isPremium && !isPremium) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setLoading(true);
    const design = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: template.name,
      templateId: template.id,
      thumbnail: template.thumbnail,
      category: template.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: {},
      isPremium: template.isPremium,
    };
    await saveDesign(design);
    setLoading(false);
    router.push(`/editor/${design.id}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <ImageBackground source={imgSource} style={styles.heroImage} resizeMode="cover">
          <LinearGradient colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(28,18,9,0.9)']} style={StyleSheet.absoluteFill} />
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backBtn, { top: (Platform.OS === 'web' ? 67 : insets.top) + 8 }]}
          >
            <Ionicons name="arrow-back" size={22} color="#FAF7F0" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleFav} style={[styles.favBtn, { top: (Platform.OS === 'web' ? 67 : insets.top) + 8 }]}>
            <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={22} color={isFav ? '#E8B4B8' : '#FAF7F0'} />
          </TouchableOpacity>
          <View style={styles.heroBottom}>
            {template.isPremium && (
              <View style={styles.premiumBadge}>
                <Ionicons name="diamond" size={12} color="#FAF7F0" />
                <Text style={styles.premiumText}>PREMIUM</Text>
              </View>
            )}
            <Text style={styles.heroName}>{template.name}</Text>
            <View style={styles.heroMeta}>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="#C9A84C" />
                <Text style={styles.ratingText}>{template.rating}</Text>
              </View>
              <Text style={styles.heroSep}>•</Text>
              <Text style={styles.heroDownloads}>{template.downloads.toLocaleString()} downloads</Text>
            </View>
          </View>
        </ImageBackground>

        {/* Details */}
        <View style={styles.details}>
          <View style={[styles.tagsRow]}>
            {template.tags.map(tag => (
              <View key={tag} style={[styles.tag, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                <Text style={[styles.tagText, { color: colors.textSecondary }]}>#{tag}</Text>
              </View>
            ))}
          </View>

          <View style={styles.colorsSection}>
            <Text style={[styles.colorsLabel, { color: colors.textSecondary }]}>Color Palette</Text>
            <View style={styles.colorsRow}>
              {template.colors.map((c, i) => (
                <View key={i} style={[styles.colorSwatch, { backgroundColor: c, borderColor: colors.border }]} />
              ))}
            </View>
          </View>

          <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {[
              { icon: 'grid-outline', label: 'Category', value: template.category },
              { icon: 'star-outline', label: 'Rating', value: `${template.rating} / 5.0` },
              { icon: 'download-outline', label: 'Downloads', value: template.downloads.toLocaleString() },
              { icon: 'diamond-outline', label: 'Type', value: template.isPremium ? 'Premium' : 'Free' },
            ].map((row, i, arr) => (
              <View key={row.label} style={[styles.infoRow, i < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.borderLight }]}>
                <Ionicons name={row.icon as 'star-outline'} size={16} color={colors.primary} />
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{row.label}</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{row.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={[styles.cta, { paddingBottom: bottomInset + 16, backgroundColor: colors.background, borderTopColor: colors.border }]}>
        {template.isPremium && !isPremium ? (
          <View style={styles.ctaRow}>
            <GoldButton label="Unlock with Pro" onPress={handleUseTemplate} loading={loading} size="lg" style={{ flex: 1 }} />
            <TouchableOpacity
              onPress={() => router.back()}
              style={[styles.previewBtn, { backgroundColor: colors.muted, borderColor: colors.border }]}
            >
              <Ionicons name="eye-outline" size={22} color={colors.primary} />
            </TouchableOpacity>
          </View>
        ) : (
          <GoldButton label="Use This Template" onPress={handleUseTemplate} loading={loading} size="lg" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroImage: { width, height: height * 0.55 },
  backBtn: { position: 'absolute', left: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  favBtn: { position: 'absolute', right: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  heroBottom: { position: 'absolute', bottom: 24, left: 20, right: 20 },
  premiumBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#B8860B', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 8 },
  premiumText: { color: '#FAF7F0', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  heroName: { color: '#FAF7F0', fontSize: 28, fontWeight: '800', letterSpacing: -0.3, fontFamily: 'CormorantGaramond_700Bold', marginBottom: 8 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { color: '#C9A84C', fontSize: 14, fontWeight: '700' },
  heroSep: { color: 'rgba(250,247,240,0.5)', fontSize: 14 },
  heroDownloads: { color: 'rgba(250,247,240,0.75)', fontSize: 13 },
  details: { padding: 20, gap: 20 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1 },
  tagText: { fontSize: 12, fontWeight: '500' },
  colorsSection: { gap: 10 },
  colorsLabel: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  colorsRow: { flexDirection: 'row', gap: 10 },
  colorSwatch: { width: 36, height: 36, borderRadius: 18, borderWidth: 1 },
  infoCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  infoLabel: { flex: 1, fontSize: 14 },
  infoValue: { fontSize: 14, fontWeight: '600', textTransform: 'capitalize' },
  cta: { padding: 20, borderTopWidth: 1 },
  ctaRow: { flexDirection: 'row', gap: 12 },
  previewBtn: { width: 54, height: 54, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 18, fontWeight: '600' },
});
