import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { AIPromptModal } from '@/components/AIPromptModal';
import { CATEGORIES } from '@/constants/templates';

const { width: SCREEN_W } = Dimensions.get('window');

const CREATE_OPTIONS = [
  {
    id: 'ai',
    label: 'AI POWERED',
    title: 'AI Generator',
    subtitle: 'Describe your vision and let AI craft a personalised invitation in seconds.',
    icon: 'sparkles-outline' as const,
    accent: '#C9A84C',
    bg: ['#1A1209', '#2E1D0E'] as [string, string],
  },
  {
    id: 'template',
    label: 'CURATED COLLECTION',
    title: 'Browse Templates',
    subtitle: 'Explore 500+ handcrafted designs across every wedding style and culture.',
    icon: 'albums-outline' as const,
    accent: '#C9A84C',
    bg: ['#1A1209', '#2E1D0E'] as [string, string],
  },
  {
    id: 'blank',
    label: 'FULL CREATIVE CONTROL',
    title: 'Start from Blank',
    subtitle: 'Begin with an empty canvas and express your unique love story.',
    icon: 'pencil-outline' as const,
    accent: '#C9A84C',
    bg: ['#1A1209', '#2E1D0E'] as [string, string],
  },
  {
    id: 'video',
    label: 'NEW · ANIMATED',
    title: 'Video Invitation',
    subtitle: 'Create a moving, cinematic invite your guests will never forget.',
    icon: 'film-outline' as const,
    accent: '#C9A84C',
    bg: ['#1A1209', '#2E1D0E'] as [string, string],
    isNew: true,
  },
];

const QUICK_CATS = CATEGORIES.slice(0, 7);

export default function CreateScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [showAI, setShowAI] = useState(false);

  const topInset = Platform.OS === 'web' ? 67 : insets.top;
  const TAB_H = 60 + (Platform.OS === 'web' ? 34 : insets.bottom);

  const handleOption = (id: string) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (id === 'ai') setShowAI(true);
    else if (id === 'template') router.push('/(tabs)/templates');
    else router.push('/editor/new');
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_H + 20 }}
      >
        {/* ── Hero ── */}
        <LinearGradient
          colors={['#110C06', '#1E1409', '#2A1B0C', colors.background]}
          style={[styles.hero, { paddingTop: topInset + 20 }]}
        >
          {/* decorative line */}
          <View style={styles.heroRule}>
            <View style={styles.ruleLine} />
            <Ionicons name="diamond-outline" size={10} color="#C9A84C" style={{ marginHorizontal: 10 }} />
            <View style={styles.ruleLine} />
          </View>

          <Text style={styles.heroEyebrow}>WEDCRAFT STUDIO</Text>
          <Text style={styles.heroTitle}>Create Your{'\n'}Masterpiece</Text>
          <Text style={styles.heroSub}>
            Every great love story deserves an invitation as{'\n'}extraordinary as the moment itself.
          </Text>
        </LinearGradient>

        {/* ── Section label ── */}
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionRule, { backgroundColor: colors.border }]} />
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>BEGIN CREATING</Text>
          <View style={[styles.sectionRule, { backgroundColor: colors.border }]} />
        </View>

        {/* ── Option Cards ── */}
        <View style={styles.cardList}>
          {CREATE_OPTIONS.map((opt, index) => (
            <TouchableOpacity
              key={opt.id}
              onPress={() => handleOption(opt.id)}
              activeOpacity={0.82}
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              {/* Left gold stripe */}
              <View style={[styles.cardStripe, { backgroundColor: opt.accent }]} />

              <View style={styles.cardBody}>
                <View style={styles.cardTop}>
                  <View style={styles.cardMeta}>
                    <Text style={[styles.cardLabel, { color: opt.accent }]}>{opt.label}</Text>
                    {opt.isNew && (
                      <View style={[styles.newPill, { borderColor: opt.accent }]}>
                        <Text style={[styles.newPillText, { color: opt.accent }]}>NEW</Text>
                      </View>
                    )}
                  </View>
                  <View style={[styles.iconWrap, { borderColor: `${opt.accent}30` }]}>
                    <Ionicons name={opt.icon} size={22} color={opt.accent} />
                  </View>
                </View>

                <Text style={[styles.cardTitle, { color: colors.text }]}>{opt.title}</Text>
                <Text style={[styles.cardSub, { color: colors.textSecondary }]}>{opt.subtitle}</Text>

                <View style={styles.cardFooter}>
                  <Text style={[styles.cardCta, { color: opt.accent }]}>Get started</Text>
                  <Ionicons name="arrow-forward" size={13} color={opt.accent} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Divider ── */}
        <View style={styles.divider}>
          <View style={[styles.divLine, { backgroundColor: colors.border }]} />
          <View style={[styles.divDiamond, { borderColor: colors.border }]} />
          <View style={[styles.divLine, { backgroundColor: colors.border }]} />
        </View>

        {/* ── Quick Start ── */}
        <View style={styles.quickSection}>
          <Text style={[styles.quickTitle, { color: colors.text }]}>Browse by Ceremony</Text>
          <Text style={[styles.quickSub, { color: colors.textSecondary }]}>
            Jump straight into a curated collection
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillRow}
          >
            {QUICK_CATS.map(cat => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => router.push(`/(tabs)/templates?category=${cat.id}`)}
                activeOpacity={0.8}
                style={[styles.pill, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <View style={[styles.pillDot, { backgroundColor: cat.color }]} />
                <Text style={[styles.pillText, { color: colors.text }]}>{cat.name}</Text>
                <Text style={[styles.pillCount, { color: colors.textMuted }]}>{cat.count}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── Inspiration Banner ── */}
        <LinearGradient
          colors={['#1A1209', '#2D1B0C']}
          style={styles.inspireBanner}
        >
          <View style={styles.inspireRule}>
            <View style={[styles.ruleLine, { backgroundColor: 'rgba(201,168,76,0.3)' }]} />
            <Ionicons name="heart" size={10} color="#C9A84C" style={{ marginHorizontal: 8 }} />
            <View style={[styles.ruleLine, { backgroundColor: 'rgba(201,168,76,0.3)' }]} />
          </View>
          <Text style={styles.inspireQuote}>
            "A wedding invitation is the first chapter of your love story."
          </Text>
          <Text style={styles.inspireAttr}>— WedCraft Design Philosophy</Text>
        </LinearGradient>
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
  root: { flex: 1 },

  /* Hero */
  hero: { paddingHorizontal: 28, paddingBottom: 36 },
  heroRule: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  ruleLine: { flex: 1, height: 1, backgroundColor: 'rgba(201,168,76,0.4)' },
  heroEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 4,
    color: '#C9A84C',
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 38,
    fontFamily: 'CormorantGaramond_700Bold',
    color: '#FAF7F0',
    lineHeight: 44,
    letterSpacing: -0.3,
    marginBottom: 14,
  },
  heroSub: {
    fontSize: 14,
    color: 'rgba(250,247,240,0.6)',
    lineHeight: 22,
    letterSpacing: 0.2,
  },

  /* Section label */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 18,
    gap: 12,
  },
  sectionRule: { flex: 1, height: 1 },
  sectionLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 3 },

  /* Option Cards */
  cardList: { paddingHorizontal: 20, gap: 14, marginBottom: 8 },
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardStripe: { width: 3 },
  cardBody: { flex: 1, padding: 18, gap: 6 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  cardLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 2.5 },
  newPill: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  newPillText: { fontSize: 8, fontWeight: '800', letterSpacing: 1.5 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'CormorantGaramond_700Bold',
    letterSpacing: 0.2,
    lineHeight: 24,
  },
  cardSub: {
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  cardCta: { fontSize: 12, fontWeight: '700', letterSpacing: 0.8 },

  /* Divider */
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    marginVertical: 28,
    gap: 12,
  },
  divLine: { flex: 1, height: 1 },
  divDiamond: {
    width: 8,
    height: 8,
    borderWidth: 1,
    transform: [{ rotate: '45deg' }],
  },

  /* Quick Start */
  quickSection: { paddingHorizontal: 20, marginBottom: 8 },
  quickTitle: {
    fontSize: 22,
    fontFamily: 'CormorantGaramond_700Bold',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  quickSub: { fontSize: 13, lineHeight: 20, marginBottom: 16 },
  pillRow: { paddingRight: 20, gap: 10 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 8,
  },
  pillDot: { width: 7, height: 7, borderRadius: 4 },
  pillText: { fontSize: 13, fontWeight: '600', letterSpacing: 0.2 },
  pillCount: { fontSize: 11, fontWeight: '500' },

  /* Inspiration Banner */
  inspireBanner: {
    marginHorizontal: 20,
    marginTop: 28,
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
  },
  inspireRule: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%',
    marginBottom: 18,
  },
  inspireQuote: {
    fontSize: 16,
    fontFamily: 'CormorantGaramond_700Bold',
    color: '#FAF7F0',
    textAlign: 'center',
    lineHeight: 26,
    letterSpacing: 0.3,
    marginBottom: 12,
  },
  inspireAttr: {
    fontSize: 11,
    color: 'rgba(201,168,76,0.8)',
    letterSpacing: 1.5,
    fontWeight: '600',
  },
});
