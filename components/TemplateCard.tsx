import React, { useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ImageBackground, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { Template } from '@/constants/templates';
import { TEMPLATE_IMAGES } from '@/lib/assets';

const SCREEN_W = Dimensions.get('window').width;
// clamp so on wide web screens it still looks like mobile
const EFFECTIVE_W = Math.min(SCREEN_W, 480);
const GAP = 12;
const H_PAD = 16;
export const CARD_W = (EFFECTIVE_W - H_PAD * 2 - GAP) / 2;

interface TemplateCardProps {
  template: Template;
  isFavorite?: boolean;
  onPress: () => void;
  onFavorite?: () => void;
  tall?: boolean;
}

export function TemplateCard({
  template, isFavorite, onPress, onFavorite, tall = false,
}: TemplateCardProps) {
  const colors = useColors();
  const cardH = tall ? CARD_W * 1.72 : CARD_W * 1.38;
  const imgSource = TEMPLATE_IMAGES[template.thumbnail] ?? TEMPLATE_IMAGES['template_modern'];

  const handleFav = useCallback(() => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onFavorite?.();
  }, [onFavorite]);

  const badge = template.isPremium ? { label: 'PRO', color: '#B8860B', icon: 'diamond' as const }
    : template.isTrending ? { label: 'HOT', color: '#C0392B', icon: 'flame' as const }
    : template.isNew ? { label: 'NEW', color: '#1B6B4A', icon: null }
    : null;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[styles.card, { width: CARD_W, height: cardH }]}
    >
      <ImageBackground source={imgSource} style={styles.image} imageStyle={styles.imageStyle}>
        {/* Dark gradient overlay from bottom */}
        <LinearGradient
          colors={['transparent', 'transparent', 'rgba(18,10,4,0.55)', 'rgba(18,10,4,0.92)']}
          style={StyleSheet.absoluteFill}
        />

        {/* Top row: badge + heart */}
        <View style={styles.topRow}>
          {badge ? (
            <View style={[styles.badge, { backgroundColor: badge.color }]}>
              {badge.icon && <Ionicons name={badge.icon} size={9} color="#FAF7F0" />}
              <Text style={styles.badgeText}>{badge.label}</Text>
            </View>
          ) : <View />}

          {onFavorite && (
            <TouchableOpacity
              onPress={handleFav}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={[styles.favBtn, { backgroundColor: isFavorite ? 'rgba(201,168,76,0.85)' : 'rgba(0,0,0,0.35)' }]}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={14}
                color="#FAF7F0"
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Bottom info */}
        <View style={styles.info}>
          {/* Color swatches */}
          <View style={styles.swatches}>
            {template.colors.slice(0, 3).map((c, i) => (
              <View key={i} style={[styles.swatch, { backgroundColor: c, marginLeft: i > 0 ? -4 : 0 }]} />
            ))}
          </View>

          <Text style={styles.cardName} numberOfLines={1}>{template.name}</Text>

          <View style={styles.metaRow}>
            <Ionicons name="star" size={10} color="#C9A84C" />
            <Text style={styles.rating}>{template.rating}</Text>
            <View style={styles.dot} />
            <Text style={styles.downloads}>
              {template.downloads >= 1000
                ? `${(template.downloads / 1000).toFixed(1)}k`
                : template.downloads}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 7,
  },
  image: { flex: 1 },
  imageStyle: { borderRadius: 18 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    color: '#FAF7F0',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  favBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    gap: 5,
  },
  swatches: { flexDirection: 'row', marginBottom: 2 },
  swatch: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  cardName: {
    color: '#FAF7F0',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.1,
    fontFamily: 'CormorantGaramond_700Bold',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  rating: { color: '#C9A84C', fontSize: 11, fontWeight: '700' },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: 'rgba(250,247,240,0.4)' },
  downloads: { color: 'rgba(250,247,240,0.65)', fontSize: 11 },
});
