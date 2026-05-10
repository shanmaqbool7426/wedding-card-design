import { Tabs } from 'expo-router';
import { View, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { BlurView } from 'expo-blur';

function TabIcon({ name, focused, color }: { name: string; focused: boolean; color: string }) {
  const isMCI = ['diamond'].includes(name);
  const IconComp = isMCI ? MaterialCommunityIcons : Ionicons;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: 32, height: 32 }}>
      {focused && (
        <View style={{
          position: 'absolute', width: 36, height: 36, borderRadius: 18,
          backgroundColor: 'rgba(201,168,76,0.15)',
        }} />
      )}
      <IconComp name={name as 'home'} size={24} color={color} />
    </View>
  );
}

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const tabBarHeight = 60 + (Platform.OS === 'web' ? 34 : insets.bottom);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          height: tabBarHeight,
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: 'transparent',
        },
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
          ) : (
            <LinearGradient
              colors={[`${colors.surface}F0`, colors.surface]}
              style={[StyleSheet.absoluteFill, { borderTopWidth: 0.5, borderTopColor: colors.border }]}
            />
          )
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginBottom: 4 },
        tabBarItemStyle: { paddingTop: 8 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color }) => <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="templates"
        options={{
          title: 'Templates',
          tabBarIcon: ({ focused, color }) => <TabIcon name={focused ? 'grid' : 'grid-outline'} focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ focused, color }) => (
            <View style={{
              width: 48, height: 48, borderRadius: 24,
              alignItems: 'center', justifyContent: 'center',
              backgroundColor: focused ? colors.primary : colors.muted,
              marginTop: -10,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 8,
              elevation: 8,
            }}>
              <Ionicons name="add" size={28} color={focused ? '#FAF7F0' : colors.textSecondary} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="designs"
        options={{
          title: 'My Designs',
          tabBarIcon: ({ focused, color }) => <TabIcon name={focused ? 'diamond' : 'diamond-outline'} focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color }) => <TabIcon name={focused ? 'person' : 'person-outline'} focused={focused} color={color} />,
        }}
      />
    </Tabs>
  );
}

import { StyleSheet } from 'react-native';
