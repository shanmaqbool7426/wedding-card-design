import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, ScrollView, Platform, ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useApp } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';
import { GoldButton } from '@/components/GoldButton';

type Mode = 'login' | 'signup';

export default function Auth() {
  const { login, continueAsGuest } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const topInset = Platform.OS === 'web' ? 67 : insets.top;
  const bottomInset = Platform.OS === 'web' ? 34 : insets.bottom;

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    await login({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      isPremium: false,
    });
    setLoading(false);
    router.replace('/(tabs)');
  };

  const handleGuest = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await continueAsGuest();
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ImageBackground
        source={require('@/assets/images/template_hindu.png')}
        style={styles.heroBg}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(28,18,9,0.7)', colors.background]}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.heroContent, { paddingTop: topInset + 20 }]}>
          <View style={styles.logoRow}>
            <LinearGradient colors={['#D4A84C', '#B8860B']} style={styles.logoBadge}>
              <Ionicons name="heart" size={20} color="#FAF7F0" />
            </LinearGradient>
            <Text style={styles.logoText}>WedCraft</Text>
          </View>
          <Text style={styles.heroTitle}>Your Perfect{'\n'}Invitation Awaits</Text>
        </View>
      </ImageBackground>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.form}>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, { paddingBottom: bottomInset + 24 }]}>
          <View style={styles.tabs}>
            {(['login', 'signup'] as Mode[]).map(m => (
              <TouchableOpacity key={m} onPress={() => setMode(m)} style={[styles.tab, mode === m && styles.tabActive]}>
                <Text style={[styles.tabText, { color: mode === m ? colors.primary : colors.textSecondary }]}>
                  {m === 'login' ? 'Sign In' : 'Create Account'}
                </Text>
                {mode === m && <View style={[styles.tabUnderline, { backgroundColor: colors.primary }]} />}
              </TouchableOpacity>
            ))}
          </View>

          {mode === 'signup' && (
            <View style={[styles.inputWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="person-outline" size={18} color={colors.textMuted} />
              <TextInput
                style={[styles.textInput, { color: colors.text }]}
                placeholder="Full Name"
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={[styles.inputWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="mail-outline" size={18} color={colors.textMuted} />
            <TextInput
              style={[styles.textInput, { color: colors.text }]}
              placeholder="Email Address"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={[styles.inputWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} />
            <TextInput
              style={[styles.textInput, { color: colors.text }]}
              placeholder="Password"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(p => !p)}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <GoldButton
            label={mode === 'login' ? 'Sign In' : 'Create Account'}
            onPress={handleSubmit}
            loading={loading}
            disabled={!email.trim() || !password.trim()}
            size="lg"
            style={styles.submitBtn}
          />

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textMuted }]}>or</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          <View style={styles.socialRow}>
            {[{ icon: 'logo-google', label: 'Google' }, { icon: 'logo-apple', label: 'Apple' }].map(s => (
              <TouchableOpacity
                key={s.label}
                style={[styles.socialBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => handleGuest()}
                activeOpacity={0.8}
              >
                <Ionicons name={s.icon as 'logo-google'} size={20} color={colors.text} />
                <Text style={[styles.socialText, { color: colors.text }]}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity onPress={handleGuest} style={styles.guestBtn}>
            <Text style={[styles.guestText, { color: colors.textSecondary }]}>Continue as Guest</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroBg: { height: 260 },
  heroContent: { flex: 1, paddingHorizontal: 24, paddingBottom: 20 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  logoBadge: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  logoText: { color: '#FAF7F0', fontSize: 20, fontWeight: '800', letterSpacing: 1 },
  heroTitle: { fontSize: 34, fontWeight: '800', color: '#FAF7F0', letterSpacing: -0.5, lineHeight: 40, fontFamily: 'CormorantGaramond_700Bold' },
  form: { flex: 1, marginTop: -20, borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
  scroll: { padding: 24 },
  tabs: { flexDirection: 'row', marginBottom: 24 },
  tab: { flex: 1, alignItems: 'center', paddingBottom: 12 },
  tabActive: {},
  tabText: { fontSize: 16, fontWeight: '700' },
  tabUnderline: { position: 'absolute', bottom: 0, height: 2, width: 60, borderRadius: 1 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 14, gap: 10, marginBottom: 12 },
  textInput: { flex: 1, fontSize: 15 },
  submitBtn: { marginTop: 8, marginBottom: 20 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 13 },
  socialRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  socialBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderRadius: 14, paddingVertical: 14 },
  socialText: { fontSize: 15, fontWeight: '600' },
  guestBtn: { alignItems: 'center', paddingVertical: 10 },
  guestText: { fontSize: 15, fontWeight: '500' },
});
