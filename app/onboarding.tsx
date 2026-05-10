import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity,
  Animated, ImageBackground, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useApp } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Create Stunning\nWedding Invitations',
    subtitle: 'Design premium cards that capture the magic of your special day',
    image: require('@/assets/images/template_hindu.png'),
    gradient: ['#7D1935', '#C9A84C'] as [string, string],
    icon: 'heart' as const,
  },
  {
    id: '2',
    title: 'AI-Powered\nDesign Magic',
    subtitle: 'Describe your dream invitation and let AI create it for you instantly',
    image: require('@/assets/images/template_destination.png'),
    gradient: ['#1A2E5A', '#C9A84C'] as [string, string],
    icon: 'sparkles' as const,
  },
  {
    id: '3',
    title: '500+ Premium\nTemplates',
    subtitle: 'From royal Indian traditions to modern minimalist western weddings',
    image: require('@/assets/images/template_modern.png'),
    gradient: ['#2D2417', '#8C7B6A'] as [string, string],
    icon: 'diamond' as const,
  },
  {
    id: '4',
    title: 'Share The\nJoy Instantly',
    subtitle: 'Export to WhatsApp, Instagram, PDF or create digital invite links',
    image: require('@/assets/images/template_muslim.png'),
    gradient: ['#1B6B4A', '#C9A84C'] as [string, string],
    icon: 'share-social' as const,
  },
];

export default function Onboarding() {
  const { completeOnboarding } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const colors = useColors();

  const topInset = Platform.OS === 'web' ? 67 : insets.top;
  const bottomInset = Platform.OS === 'web' ? 34 : insets.bottom;

  const handleNext = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentIndex < SLIDES.length - 1) {
      const next = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setCurrentIndex(next);
    } else {
      await completeOnboarding();
      router.replace('/auth');
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
    router.replace('/auth');
  };

  const slide = SLIDES[currentIndex];

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        renderItem={({ item }) => (
          <ImageBackground source={item.image} style={{ width, height }} resizeMode="cover">
            <LinearGradient
              colors={[`${item.gradient[0]}CC`, `${item.gradient[1]}EE`]}
              style={StyleSheet.absoluteFill}
            />
          </ImageBackground>
        )}
        keyExtractor={i => i.id}
      />

      <View style={[StyleSheet.absoluteFill, { paddingTop: topInset, paddingBottom: bottomInset + 16 }]}>
        <TouchableOpacity style={styles.skip} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Ionicons name={slide.icon} size={32} color="#FAF7F0" />
          </View>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.subtitle}>{slide.subtitle}</Text>
        </View>

        <View style={styles.bottom}>
          <View style={styles.dots}>
            {SLIDES.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === currentIndex ? styles.dotActive : styles.dotInactive,
                ]}
              />
            ))}
          </View>

          <TouchableOpacity onPress={handleNext} style={styles.nextBtn} activeOpacity={0.85}>
            <LinearGradient colors={['#D4A84C', '#B8860B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.nextGrad}>
              <Text style={styles.nextText}>
                {currentIndex === SLIDES.length - 1 ? "Let's Begin" : 'Next'}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#FAF7F0" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1C1209' },
  skip: { alignSelf: 'flex-end', paddingHorizontal: 24, paddingVertical: 10 },
  skipText: { color: 'rgba(250,247,240,0.8)', fontSize: 15, fontWeight: '500' },
  content: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: 32, paddingBottom: 48 },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(201,168,76,0.25)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.4)',
    marginBottom: 24,
  },
  title: {
    fontSize: 38, fontWeight: '800', color: '#FAF7F0',
    letterSpacing: -1, lineHeight: 44, marginBottom: 16,
    fontFamily: 'CormorantGaramond_700Bold',
  },
  subtitle: { fontSize: 17, color: 'rgba(250,247,240,0.8)', lineHeight: 26 },
  bottom: { paddingHorizontal: 32, gap: 24 },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { height: 4, borderRadius: 2 },
  dotActive: { width: 24, backgroundColor: '#C9A84C' },
  dotInactive: { width: 8, backgroundColor: 'rgba(250,247,240,0.4)' },
  nextBtn: { borderRadius: 16, overflow: 'hidden', shadowColor: '#B8860B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6 },
  nextGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18 },
  nextText: { color: '#FAF7F0', fontSize: 17, fontWeight: '800', letterSpacing: 0.3 },
});
