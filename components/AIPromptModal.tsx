import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Modal, ScrollView, Animated, ActivityIndicator, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { AI_STYLES } from '@/constants/templates';

interface AIPromptModalProps {
  visible: boolean;
  onClose: () => void;
  onGenerate: (prompt: string, style: string) => void;
}

const SUGGESTIONS = [
  'A royal Hindu wedding with golden mandala border',
  'Elegant minimal white wedding with botanical florals',
  'Royal destination beach wedding under stars',
  'Traditional Muslim Nikah with geometric Islamic art',
  'A Punjabi wedding with vibrant colors and folk art',
  'Intimate Christian chapel wedding with roses',
];

export function AIPromptModal({ visible, onClose, onGenerate }: AIPromptModalProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('royal');
  const [isGenerating, setIsGenerating] = useState(false);
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsGenerating(true);

    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    await new Promise(r => setTimeout(r, 2000));
    setIsGenerating(false);
    onGenerate(prompt, selectedStyle);
    setPrompt('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.handle, { backgroundColor: colors.border }]} />

        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>AI Invitation</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Describe your dream wedding card</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.muted }]}>
            <Ionicons name="close" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
          <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="sparkles" size={18} color={colors.primary} style={{ marginTop: 14 }} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="E.g. A royal Rajasthani wedding with gold mandalas and deep maroon..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={4}
              value={prompt}
              onChangeText={setPrompt}
              textAlignVertical="top"
            />
          </View>

          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Quick Suggestions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsRow}>
            {SUGGESTIONS.map((s, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setPrompt(s)}
                style={[styles.suggestionChip, { backgroundColor: colors.muted, borderColor: colors.border }]}
              >
                <Text style={[styles.suggestionText, { color: colors.text }]} numberOfLines={2}>{s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Style Preset</Text>
          <View style={styles.stylesGrid}>
            {AI_STYLES.map(style => (
              <TouchableOpacity
                key={style.id}
                onPress={() => { Haptics.selectionAsync(); setSelectedStyle(style.id); }}
                style={[styles.styleChip, selectedStyle === style.id && styles.styleSelected]}
              >
                <LinearGradient colors={style.gradient as [string, string]} style={styles.styleGradient}>
                  <Text style={styles.styleLabel}>{style.label}</Text>
                  {selectedStyle === style.id && (
                    <Ionicons name="checkmark-circle" size={14} color="#FAF7F0" />
                  )}
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity
            onPress={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            style={[styles.generateBtn, { opacity: !prompt.trim() ? 0.5 : 1 }]}
            activeOpacity={0.85}
          >
            <LinearGradient colors={['#D4A84C', '#B8860B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.generateGradient}>
              {isGenerating ? (
                <ActivityIndicator color="#FAF7F0" size="small" />
              ) : (
                <>
                  <Ionicons name="sparkles" size={18} color="#FAF7F0" />
                  <Text style={styles.generateText}>Generate Invitation</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 8 },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, marginTop: 2 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1, paddingHorizontal: 20 },
  inputContainer: {
    flexDirection: 'row', gap: 10, borderWidth: 1, borderRadius: 16, padding: 12, minHeight: 120,
  },
  input: { flex: 1, fontSize: 15, lineHeight: 22 },
  sectionLabel: { fontSize: 13, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 20, marginBottom: 12 },
  suggestionsRow: { marginBottom: 4, marginHorizontal: -20, paddingHorizontal: 20 },
  suggestionChip: {
    borderWidth: 1, borderRadius: 10, padding: 10, marginRight: 10, width: 160,
  },
  suggestionText: { fontSize: 12, lineHeight: 17 },
  stylesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingBottom: 20 },
  styleChip: { borderRadius: 12, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent' },
  styleSelected: { borderColor: '#C9A84C' },
  styleGradient: { paddingHorizontal: 14, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 6 },
  styleLabel: { color: '#FAF7F0', fontSize: 13, fontWeight: '700' },
  footer: { paddingHorizontal: 20, paddingTop: 12 },
  generateBtn: { borderRadius: 16, overflow: 'hidden', shadowColor: '#B8860B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6 },
  generateGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18 },
  generateText: { color: '#FAF7F0', fontSize: 17, fontWeight: '800', letterSpacing: 0.3 },
});
