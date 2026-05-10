import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { Template } from '@/constants/templates';
import { TEMPLATE_IMAGES } from '@/lib/assets';

const { width } = Dimensions.get('window');
const CARD_W = (width - 48) / 2;

interface TemplateCardProps {
  template: Template;
  isFavorite?: boolean;
  onPress: () => void;
  onFavorite?: () => void;
  size?: 'normal' | 'large';
}

export function TemplateCard({ template, isFavorite, onPress, onFavorite, size = 'normal' }: TemplateCardProps) {
  const colors = useColors();
  const cardH = size === 'large' ? CARD_W * 1.6 : CARD_W * 1.45;
  const imgSource = TEMPLATE_IMAGES[template.thumbnail] ?? TEMPLATE_IMAGES['template_modern'];

  const handleFav = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onFavorite?.();
  }, [onFavorite]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.92} style={[styles.card, { width: size === 'large' ? CARD_W * 1.15 : CARD_W, height: cardH }]}>
      <ImageBackground source={imgSource} style={styles.image} imageStyle={styles.imageStyle}>
        <LinearGradient
          colors={['transparent', 'rgba(28,18,9,0.85)']}
          style={styles.overlay}
        >
          {template.isPremium && (
            <View style={styles.premiumBadge}>
              <Ionicons name="diamond" size={10} color="#FAF7F0" />
              <Text style={styles.premiumText}>PRO</Text>
            </View>
          )}
          {template.isTrending && !template.isPremium && (
            <View style={[styles.premiumBadge, { backgroundColor: '#C0392B' }]}>
              <Ionicons name="flame" size={10} color="#FAF7F0" />
              <Text style={styles.premiumText}>HOT</Text>
            </View>
          )}
          {template.isNew && !template.isTrending && !template.isPremium && (
            <View style={[styles.premiumBadge, { backgroundColor: '#2E7D52' }]}>
              <Text style={styles.premiumText}>NEW</Text>
            </View>
          )}
          <View style={styles.bottom}>
            <Text style={styles.name} numberOfLines={1}>{template.name}</Text>
            <View style={styles.meta}>
              <View style={styles.rating}>
                <Ionicons name="star" size={10} color="#C9A84C" />
                <Text style={styles.ratingText}>{template.rating}</Text>
              </View>
              <Text style={styles.downloads}>{(template.downloads / 1000).toFixed(1)}k</Text>
            </View>
          </View>
        </LinearGradient>
        {onFavorite && (
          <TouchableOpacity style={styles.favBtn} onPress={handleFav} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={18} color={isFavorite ? '#E8B4B8' : '#FAF7F0'} />
          </TouchableOpacity>
        )}
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  image: { flex: 1 },
  imageStyle: { borderRadius: 16 },
  overlay: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B8860B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 3,
  },
  premiumText: {
    color: '#FAF7F0',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bottom: { gap: 4 },
  name: {
    color: '#FAF7F0',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { color: '#C9A84C', fontSize: 11, fontWeight: '600' },
  downloads: { color: 'rgba(250,247,240,0.7)', fontSize: 11 },
  favBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
  },
});
