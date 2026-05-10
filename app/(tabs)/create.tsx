import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { AIPromptModal } from '@/components/AIPromptModal';
import { CATEGORIES } from '@/constants/templates';

const CREATE_OPTIONS = [
  {
    id: 'ai',
    title: 'AI Generator',
    subtitle: 'Describe your dream card',
    icon: 'sparkles' as const,
    gradient: ['#1A2E5A', '#6B3FA0'] as [string, string],
    isNew: false,
  },
  {
    id: 'template',
    title: 'From Template',
    subtitle: 'Browse 500+ designs',
    icon: 'grid' as const,
    gradient: ['#7D1935', '#C9A84C'] as [string, string],
    isNew: false,
  },
  {
    id: 'blank',
    title: 'Start Blank',
    subtitle: 'Build from scratch',
    icon: 'create' as const,
    gradient: ['#2D2417', '#8C7B6A'] as [string, string],
    isNew: false,
  },
  {
    id: 'video',
    title: 'Video Invite',
    subtitle: 'Animated invitation',
    icon: 'videocam' as const,
    gradient: ['#1B6B4A', '#C9A84C'] as [string, string],
    isNew: true,
  },
];

const QUICK_CATEGORIES = CATEGORIES.slice(0, 8);

export default function CreateScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [showAI, setShowAI] = useState(false);

  const topInset = Platform.OS === 'web' ? 67 : insets.top;
  const TAB_H = 60 + (Platform.OS === 'web' ? 34 : insets.bottom);

  const handleOption = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (id === 'ai') {
      setShowAI(true);
    } else if (id === 'template') {
      router.push('/(tabs)/templates');
    } else {
      router.push('/editor/new');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: TAB_H + 16 }}>
        <LinearGradient colors={['#1C1209', '#2D1E0F', colors.background]} style={[styles.hero, { paddingTop: topInset + 16 }]}>
          <Text style={styles.heroTitle}>Create Your{'\n'}Masterpiece</Text>
          <Text style={styles.heroSub}>What kind of invitation would you like to create?</Text>
        </LinearGradient>

        <View style={styles.optionsGrid}>
          {CREATE_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.id}
              onPress={() => handleOption(opt.id)}
              activeOpacity={0.88}
              style={styles.optionCard}
            >
              <LinearGradient colors={opt.gradient} style={styles.optionGrad}>
                {opt.isNew && (
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                  </View>
                )}
                <View style={styles.optionIcon}>
                  <Ionicons name={opt.icon} size={28} color="#FAF7F0" />
                </View>
                <Text style={styles.optionTitle}>{opt.title}</Text>
                <Text style={styles.optionSub}>{opt.subtitle}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Start by Category */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Start by Event</Text>
          <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>Choose an event type to start instantly</Text>
          <View style={styles.quickGrid}>
            {QUICK_CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => router.push(`/(tabs)/templates?category=${cat.id}`)}
                activeOpacity={0.85}
                style={[styles.quickCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <View style={[styles.quickIcon, { backgroundColor: `${cat.color}20` }]}>
                  <MaterialCommunityIcons name="flower" size={20} color={cat.color} />
                </View>
                <Text style={[styles.quickName, { color: colors.text }]} numberOfLines={2}>{cat.name}</Text>
                <Text style={[styles.quickCount, { color: colors.textMuted }]}>{cat.count}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pro Tips */}
        <View style={[styles.tipsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb" size={18} color="#C9A84C" />
            <Text style={[styles.tipsTitle, { color: colors.text }]}>Design Tips</Text>
          </View>
          {[
            'Use high-resolution photos for best print quality',
            'Match your color palette to the wedding theme',
            'Keep text minimal — let the design speak',
          ].map((tip, i) => (
            <View key={i} style={styles.tip}>
              <View style={[styles.tipDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>{tip}</Text>
            </View>
          ))}
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
  hero: { padding: 24, paddingBottom: 28 },
  heroTitle: { fontSize: 34, fontWeight: '800', color: '#FAF7F0', letterSpacing: -0.5, lineHeight: 40, fontFamily: 'CormorantGaramond_700Bold', marginBottom: 10 },
  heroSub: { color: 'rgba(250,247,240,0.7)', fontSize: 15 },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, padding: 20, paddingTop: 8 },
  optionCard: { width: '47.5%', borderRadius: 18, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },
  optionGrad: { padding: 20, minHeight: 150 },
  newBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: '#C9A84C', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  newBadgeText: { color: '#FAF7F0', fontSize: 9, fontWeight: '800' },
  optionIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(250,247,240,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  optionTitle: { color: '#FAF7F0', fontSize: 16, fontWeight: '800', marginBottom: 4 },
  optionSub: { color: 'rgba(250,247,240,0.75)', fontSize: 12 },
  section: { paddingHorizontal: 20, marginTop: 8, marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
  sectionSub: { fontSize: 13, marginBottom: 16 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickCard: { width: '22%', alignItems: 'center', borderRadius: 14, padding: 10, borderWidth: 1, gap: 6 },
  quickIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  quickName: { fontSize: 10, fontWeight: '600', textAlign: 'center', lineHeight: 14 },
  quickCount: { fontSize: 10 },
  tipsCard: { marginHorizontal: 20, marginTop: 8, marginBottom: 20, borderRadius: 16, padding: 18, borderWidth: 1 },
  tipsHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  tipsTitle: { fontSize: 15, fontWeight: '700' },
  tip: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  tipDot: { width: 6, height: 6, borderRadius: 3, marginTop: 7 },
  tipText: { flex: 1, fontSize: 13, lineHeight: 20 },
});
