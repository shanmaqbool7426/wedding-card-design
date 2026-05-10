import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { Category } from '@/constants/templates';

interface CategoryPillProps {
  category: Category;
  isSelected: boolean;
  onPress: () => void;
}

function CategoryIcon({ icon, color, size = 14 }: { icon: string; color: string; size?: number }) {
  const ionIcons: Record<string, string> = {
    heart: 'heart', star: 'star', moon: 'moon', sun: 'sunny',
    music: 'musical-notes', calendar: 'calendar', gift: 'gift', map: 'map',
  };
  const mciIcons: Record<string, string> = {
    flower: 'flower', diamond: 'diamond', ring: 'ring', leaf: 'leaf',
    feather: 'feather', 'map-pin': 'map-marker',
  };

  if (ionIcons[icon]) {
    return <Ionicons name={ionIcons[icon] as 'heart'} size={size} color={color} />;
  }
  if (mciIcons[icon]) {
    return <MaterialCommunityIcons name={mciIcons[icon] as 'flower'} size={size} color={color} />;
  }
  return <Feather name="star" size={size} color={color} />;
}

export function CategoryPill({ category, isSelected, onPress }: CategoryPillProps) {
  const colors = useColors();

  const handlePress = () => {
    Haptics.selectionAsync();
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={[
        styles.pill,
        {
          backgroundColor: isSelected ? category.color : colors.surface,
          borderColor: isSelected ? category.color : colors.border,
          shadowColor: isSelected ? category.color : 'transparent',
        },
      ]}
    >
      <CategoryIcon
        icon={category.icon}
        color={isSelected ? '#FAF7F0' : category.color}
        size={13}
      />
      <Text style={[styles.label, { color: isSelected ? '#FAF7F0' : colors.text }]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

export function CategoryGrid({ categories, selected, onSelect }: {
  categories: Category[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <View style={styles.grid}>
      {categories.map(cat => (
        <CategoryPill
          key={cat.id}
          category={cat}
          isSelected={selected === cat.id}
          onPress={() => onSelect(cat.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
