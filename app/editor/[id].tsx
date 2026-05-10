import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, Alert, Dimensions, PanResponder, Platform,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { saveDesign } from '@/lib/storage';
import { TEMPLATE_IMAGES } from '@/lib/assets';
import { MOCK_TEMPLATES } from '@/constants/templates';

const { width, height } = Dimensions.get('window');
const CANVAS_W = width;
const CANVAS_H = height * 0.5;

interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontWeight: '400' | '700';
  fontFamily: string;
}

const FONT_OPTS = ['Inter_400Regular', 'CormorantGaramond_700Bold'];
const COLOR_OPTS = ['#FAF7F0', '#C9A84C', '#7D1935', '#1A2E5A', '#2D2417', '#E8B4B8', '#1B6B4A', '#6B3FA0'];
const TOOL_TABS = ['Text', 'Style', 'Stickers', 'Export'] as const;
type ToolTab = typeof TOOL_TABS[number];

const STICKERS = ['🌸', '💍', '💐', '🕊️', '🌹', '✨', '🎊', '🌙', '⭐', '🌺', '🦋', '💎'];

export default function EditorScreen() {
  const { id, prompt, style } = useLocalSearchParams<{ id: string; prompt?: string; style?: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { refreshDesigns } = useApp();

  const template = MOCK_TEMPLATES[0];
  const imgSource = TEMPLATE_IMAGES[template.thumbnail];

  const [layers, setLayers] = useState<TextLayer[]>([
    { id: '1', text: 'Bride & Groom', x: CANVAS_W / 2 - 80, y: 60, fontSize: 28, color: '#FAF7F0', fontWeight: '700', fontFamily: 'CormorantGaramond_700Bold' },
    { id: '2', text: 'Request the pleasure of your company', x: 40, y: 120, fontSize: 13, color: 'rgba(250,247,240,0.85)', fontWeight: '400', fontFamily: 'Inter_400Regular' },
    { id: '3', text: '25th December 2025', x: CANVAS_W / 2 - 70, y: 180, fontSize: 16, color: '#C9A84C', fontWeight: '700', fontFamily: 'CormorantGaramond_700Bold' },
  ]);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ToolTab>('Text');
  const [designName, setDesignName] = useState(prompt ? `AI: ${prompt.slice(0, 25)}...` : 'My Invitation');
  const [bgGradient, setBgGradient] = useState<[string, string]>(['#7D1935', '#C9A84C']);
  const [isSaving, setIsSaving] = useState(false);

  const topInset = Platform.OS === 'web' ? 67 : insets.top;
  const bottomInset = Platform.OS === 'web' ? 34 : insets.bottom;

  const selectedL = layers.find(l => l.id === selectedLayer);

  const updateLayer = (id: string, changes: Partial<TextLayer>) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, ...changes } : l));
  };

  const addTextLayer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newLayer: TextLayer = {
      id: Date.now().toString(),
      text: 'Tap to edit',
      x: 60,
      y: 100 + layers.length * 40,
      fontSize: 16,
      color: '#FAF7F0',
      fontWeight: '400',
      fontFamily: 'Inter_400Regular',
    };
    setLayers(prev => [...prev, newLayer]);
    setSelectedLayer(newLayer.id);
  };

  const deleteLayer = (id: string) => {
    setLayers(prev => prev.filter(l => l.id !== id));
    setSelectedLayer(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await saveDesign({
      id: id === 'new' ? Date.now().toString() + Math.random().toString(36).substr(2, 9) : id,
      name: designName,
      templateId: template.id,
      thumbnail: template.thumbnail,
      category: template.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: { layers, bgGradient },
      isPremium: false,
    });
    await refreshDesigns();
    setIsSaving(false);
    Alert.alert('Saved!', 'Your design has been saved.', [
      { text: 'Continue Editing', style: 'cancel' },
      { text: 'My Designs', onPress: () => router.push('/(tabs)/designs') },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient colors={['#1C1209', '#2D1E0F']} style={[styles.header, { paddingTop: topInset + 4 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="close" size={22} color="#FAF7F0" />
        </TouchableOpacity>
        <TextInput
          value={designName}
          onChangeText={setDesignName}
          style={styles.headerTitle}
          numberOfLines={1}
        />
        <TouchableOpacity onPress={handleSave} disabled={isSaving} style={styles.saveBtn} activeOpacity={0.85}>
          <LinearGradient colors={['#D4A84C', '#B8860B']} style={styles.saveBtnGrad}>
            {isSaving ? (
              <Text style={styles.saveBtnText}>...</Text>
            ) : (
              <>
                <Ionicons name="checkmark" size={16} color="#FAF7F0" />
                <Text style={styles.saveBtnText}>Save</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>

      {/* Canvas */}
      <View style={[styles.canvas, { height: CANVAS_H }]}>
        <LinearGradient colors={bgGradient} style={StyleSheet.absoluteFill} />
        <ImageBackground source={imgSource} style={StyleSheet.absoluteFill} imageStyle={{ opacity: 0.3, resizeMode: 'cover' }} />

        {layers.map(layer => (
          <DraggableText
            key={layer.id}
            layer={layer}
            isSelected={selectedLayer === layer.id}
            onSelect={() => setSelectedLayer(layer.id)}
            onMove={(x, y) => updateLayer(layer.id, { x, y })}
          />
        ))}

        {/* Add Layer FAB */}
        <TouchableOpacity onPress={addTextLayer} style={styles.addLayerBtn}>
          <Ionicons name="text" size={18} color="#FAF7F0" />
        </TouchableOpacity>
      </View>

      {/* Tools */}
      <View style={[styles.tools, { flex: 1, backgroundColor: colors.surface }]}>
        <View style={[styles.toolTabs, { borderBottomColor: colors.border }]}>
          {TOOL_TABS.map(tab => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.toolTab, activeTab === tab && styles.toolTabActive]}>
              <Text style={[styles.toolTabText, { color: activeTab === tab ? colors.primary : colors.textMuted }]}>{tab}</Text>
              {activeTab === tab && <View style={[styles.toolTabLine, { backgroundColor: colors.primary }]} />}
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: bottomInset + 16 }}>
          {activeTab === 'Text' && (
            <>
              {selectedL ? (
                <>
                  <View style={[styles.textInputWrap, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <TextInput
                      value={selectedL.text}
                      onChangeText={v => updateLayer(selectedL.id, { text: v })}
                      style={[styles.layerInput, { color: colors.text }]}
                      multiline
                      placeholder="Enter text..."
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                  <View style={styles.controlRow}>
                    <Text style={[styles.controlLabel, { color: colors.textSecondary }]}>Size: {selectedL.fontSize}px</Text>
                    <View style={styles.sizeControls}>
                      <TouchableOpacity onPress={() => updateLayer(selectedL.id, { fontSize: Math.max(10, selectedL.fontSize - 2) })} style={[styles.sizeBtn, { backgroundColor: colors.muted }]}>
                        <Ionicons name="remove" size={16} color={colors.text} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => updateLayer(selectedL.id, { fontSize: Math.min(64, selectedL.fontSize + 2) })} style={[styles.sizeBtn, { backgroundColor: colors.muted }]}>
                        <Ionicons name="add" size={16} color={colors.text} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View>
                    <Text style={[styles.controlLabel, { color: colors.textSecondary }]}>Text Color</Text>
                    <View style={styles.colorRow}>
                      {COLOR_OPTS.map(c => (
                        <TouchableOpacity key={c} onPress={() => updateLayer(selectedL.id, { color: c })} style={[styles.colorDot, { backgroundColor: c, borderColor: selectedL.color === c ? colors.primary : 'transparent' }]} />
                      ))}
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => deleteLayer(selectedL.id)} style={[styles.deleteBtn, { borderColor: colors.error }]}>
                    <Ionicons name="trash-outline" size={16} color={colors.error} />
                    <Text style={[styles.deleteBtnText, { color: colors.error }]}>Remove Layer</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity onPress={addTextLayer} style={[styles.addTextBtn, { borderColor: colors.border }]}>
                  <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
                  <Text style={[styles.addTextLabel, { color: colors.primary }]}>Add Text Layer</Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {activeTab === 'Style' && (
            <View style={styles.bgSection}>
              <Text style={[styles.controlLabel, { color: colors.textSecondary }]}>Background Gradient</Text>
              {[
                ['#7D1935', '#C9A84C'] as [string, string],
                ['#1A2E5A', '#6B3FA0'] as [string, string],
                ['#1B6B4A', '#C9A84C'] as [string, string],
                ['#1C1209', '#4A3020'] as [string, string],
                ['#2D2417', '#8C7B6A'] as [string, string],
                ['#6B3FA0', '#E8B4B8'] as [string, string],
              ].map((grad, i) => (
                <TouchableOpacity key={i} onPress={() => setBgGradient(grad)} style={[styles.gradOption, { borderColor: JSON.stringify(grad) === JSON.stringify(bgGradient) ? colors.primary : 'transparent' }]}>
                  <LinearGradient colors={grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradPreview} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {activeTab === 'Stickers' && (
            <View style={styles.stickersGrid}>
              {STICKERS.map(s => (
                <TouchableOpacity key={s} onPress={() => {
                  Haptics.selectionAsync();
                  const sl: TextLayer = { id: Date.now().toString(), text: s, x: 100, y: 150, fontSize: 32, color: '#FAF7F0', fontWeight: '400', fontFamily: 'Inter_400Regular' };
                  setLayers(prev => [...prev, sl]);
                  setSelectedLayer(sl.id);
                }} style={[styles.stickerBtn, { backgroundColor: colors.muted }]}>
                  <Text style={styles.stickerText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {activeTab === 'Export' && (
            <View style={styles.exportOptions}>
              {[
                { icon: 'image', label: 'Export as PNG', sub: 'High quality image' },
                { icon: 'document', label: 'Export as PDF', sub: 'Print ready' },
                { icon: 'share-social', label: 'Share via WhatsApp', sub: 'Send directly' },
                { icon: 'logo-instagram', label: 'Instagram Story', sub: '9:16 format' },
              ].map(opt => (
                <TouchableOpacity
                  key={opt.label}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); Alert.alert('Coming Soon', `${opt.label} export will be available in the next update.`); }}
                  style={[styles.exportBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
                  activeOpacity={0.8}
                >
                  <View style={[styles.exportIcon, { backgroundColor: `${colors.primary}20` }]}>
                    <Ionicons name={opt.icon as 'image'} size={20} color={colors.primary} />
                  </View>
                  <View style={styles.exportText}>
                    <Text style={[styles.exportLabel, { color: colors.text }]}>{opt.label}</Text>
                    <Text style={[styles.exportSub, { color: colors.textMuted }]}>{opt.sub}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

function DraggableText({ layer, isSelected, onSelect, onMove }: {
  layer: TextLayer;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
}) {
  const offsetRef = useRef({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (_, gs) => {
        offsetRef.current = { x: layer.x, y: layer.y };
        onSelect();
      },
      onPanResponderMove: (_, gs) => {
        onMove(offsetRef.current.x + gs.dx, offsetRef.current.y + gs.dy);
      },
    })
  ).current;

  return (
    <View
      {...panResponder.panHandlers}
      style={[
        styles.textLayer,
        { left: layer.x, top: layer.y },
        isSelected && styles.textLayerSelected,
      ]}
    >
      <Text style={{
        color: layer.color,
        fontSize: layer.fontSize,
        fontWeight: layer.fontWeight,
        fontFamily: layer.fontFamily,
      }}>
        {layer.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingBottom: 10, gap: 8 },
  headerBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(250,247,240,0.1)' },
  headerTitle: { flex: 1, color: '#FAF7F0', fontSize: 15, fontWeight: '700', textAlign: 'center' },
  saveBtn: { borderRadius: 10, overflow: 'hidden' },
  saveBtnGrad: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8 },
  saveBtnText: { color: '#FAF7F0', fontSize: 13, fontWeight: '700' },
  canvas: { width: '100%', overflow: 'hidden' },
  addLayerBtn: { position: 'absolute', bottom: 12, right: 12, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(201,168,76,0.8)', alignItems: 'center', justifyContent: 'center' },
  textLayer: { position: 'absolute' },
  textLayerSelected: { borderWidth: 1, borderColor: '#C9A84C', borderStyle: 'dashed', padding: 4, borderRadius: 4 },
  tools: { borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' },
  toolTabs: { flexDirection: 'row', borderBottomWidth: 1 },
  toolTab: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  toolTabActive: {},
  toolTabText: { fontSize: 13, fontWeight: '600' },
  toolTabLine: { position: 'absolute', bottom: 0, height: 2, width: 40, borderRadius: 1 },
  textInputWrap: { borderWidth: 1, borderRadius: 12, padding: 12 },
  layerInput: { fontSize: 15, minHeight: 60 },
  controlRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  controlLabel: { fontSize: 13, fontWeight: '600' },
  sizeControls: { flexDirection: 'row', gap: 8 },
  sizeBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  colorRow: { flexDirection: 'row', gap: 10, marginTop: 8, flexWrap: 'wrap' },
  colorDot: { width: 30, height: 30, borderRadius: 15, borderWidth: 2 },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 10, padding: 10, justifyContent: 'center' },
  deleteBtnText: { fontSize: 14, fontWeight: '600' },
  addTextBtn: { borderWidth: 1.5, borderStyle: 'dashed', borderRadius: 14, padding: 24, alignItems: 'center', gap: 8 },
  addTextLabel: { fontSize: 15, fontWeight: '600' },
  bgSection: { gap: 10 },
  gradOption: { borderWidth: 2, borderRadius: 12, overflow: 'hidden' },
  gradPreview: { height: 40 },
  stickersGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stickerBtn: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  stickerText: { fontSize: 28 },
  exportOptions: { gap: 10 },
  exportBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderRadius: 14, padding: 14 },
  exportIcon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  exportText: { flex: 1 },
  exportLabel: { fontSize: 14, fontWeight: '600' },
  exportSub: { fontSize: 12, marginTop: 1 },
});
