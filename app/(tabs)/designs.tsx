import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { Design, deleteDesign } from '@/lib/storage';

export default function DesignsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { designs, refreshDesigns } = useApp();
  const [selectedDesigns, setSelectedDesigns] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  const topInset = Platform.OS === 'web' ? 67 : insets.top;
  const TAB_H = 60 + (Platform.OS === 'web' ? 34 : insets.bottom);

  useEffect(() => { refreshDesigns(); }, []);

  const handleDelete = async (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert('Delete Design', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          await deleteDesign(id);
          refreshDesigns();
        }
      },
    ]);
  };

  const EmptyState = () => (
    <View style={styles.empty}>
      <View style={[styles.emptyIcon, { backgroundColor: colors.muted }]}>
        <Ionicons name="images-outline" size={40} color={colors.textMuted} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No Designs Yet</Text>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        Start creating your first wedding invitation masterpiece
      </Text>
      <TouchableOpacity
        onPress={() => router.push('/(tabs)/create')}
        style={styles.emptyBtn}
        activeOpacity={0.85}
      >
        <LinearGradient colors={['#D4A84C', '#B8860B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.emptyBtnGrad}>
          <Ionicons name="add" size={18} color="#FAF7F0" />
          <Text style={styles.emptyBtnText}>Create First Design</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const DesignItem = ({ item }: { item: Design }) => (
    <TouchableOpacity
      onPress={() => router.push(`/editor/${item.id}`)}
      onLongPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); handleDelete(item.id); }}
      activeOpacity={0.88}
      style={[styles.designCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <LinearGradient
        colors={['#7D1935', '#C9A84C']}
        style={styles.designThumbnail}
      >
        <Ionicons name="heart" size={28} color="rgba(250,247,240,0.4)" />
        <Text style={styles.thumbnailText}>{item.name?.charAt(0) ?? 'W'}</Text>
      </LinearGradient>
      <View style={styles.designInfo}>
        <Text style={[styles.designName, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
        <Text style={[styles.designCategory, { color: colors.textSecondary }]}>{item.category}</Text>
        <Text style={[styles.designDate, { color: colors.textMuted }]}>
          {new Date(item.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </Text>
      </View>
      <View style={styles.designActions}>
        <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }} style={[styles.actionBtn, { backgroundColor: colors.muted }]}>
          <Ionicons name="share-outline" size={16} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={[styles.actionBtn, { backgroundColor: colors.muted }]}>
          <Ionicons name="trash-outline" size={16} color={colors.error} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topInset + 8, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>My Designs</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{designs.length} creation{designs.length !== 1 ? 's' : ''}</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(tabs)/create')} style={styles.createBtn}>
          <LinearGradient colors={['#D4A84C', '#B8860B']} style={styles.createBtnGrad}>
            <Ionicons name="add" size={20} color="#FAF7F0" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <FlatList
        data={designs}
        keyExtractor={d => d.id}
        contentContainerStyle={{ padding: 16, paddingBottom: TAB_H + 16, gap: 12 }}
        ListEmptyComponent={<EmptyState />}
        renderItem={({ item }) => <DesignItem item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 14, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', borderBottomWidth: 1 },
  title: { fontSize: 28, fontWeight: '800', fontFamily: 'CormorantGaramond_700Bold' },
  subtitle: { fontSize: 13, marginTop: 2 },
  createBtn: { borderRadius: 22, overflow: 'hidden' },
  createBtnGrad: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  empty: { flex: 1, alignItems: 'center', paddingTop: 80, paddingHorizontal: 32, gap: 12 },
  emptyIcon: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  emptyTitle: { fontSize: 22, fontWeight: '800' },
  emptyText: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  emptyBtn: { marginTop: 8, borderRadius: 14, overflow: 'hidden' },
  emptyBtnGrad: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 14 },
  emptyBtnText: { color: '#FAF7F0', fontSize: 15, fontWeight: '700' },
  designCard: { flexDirection: 'row', borderRadius: 16, overflow: 'hidden', borderWidth: 1, alignItems: 'center' },
  designThumbnail: { width: 80, height: 80, alignItems: 'center', justifyContent: 'center' },
  thumbnailText: { position: 'absolute', color: '#FAF7F0', fontSize: 28, fontWeight: '800', fontFamily: 'CormorantGaramond_700Bold' },
  designInfo: { flex: 1, padding: 14, gap: 2 },
  designName: { fontSize: 15, fontWeight: '700' },
  designCategory: { fontSize: 12, textTransform: 'capitalize' },
  designDate: { fontSize: 11, marginTop: 4 },
  designActions: { flexDirection: 'row', gap: 8, paddingRight: 14 },
  actionBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
});
