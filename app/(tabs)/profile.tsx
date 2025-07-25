import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { supabase } from '@/constants/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.replace('/login');
  };

  return (
    <LinearGradient colors={["#f5f7fa", "#c3cfe2"]} style={styles.gradient}>
      <View style={styles.outerContainer}>
        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            <IconSymbol name="person.fill" size={54} color="#4F8CFF" />
          </View>
          <ThemedText style={styles.title}>Profil</ThemedText>
          {user ? (
            <>
              <ThemedText style={styles.name}>{user.user_metadata?.name || 'Kullanıcı'}</ThemedText>
              <ThemedText style={styles.email}>{user.email}</ThemedText>
            </>
          ) : (
            <ActivityIndicator />
          )}
          <ThemedText style={styles.infoSmall}>Bitki bakım uygulamasına hoş geldiniz! Bitkilerinizi ekleyin, bakım hatırlatmaları alın ve doğayla bağınızı güçlendirin.</ThemedText>
          {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
          <TouchableOpacity
            style={styles.onboardingButton}
            onPress={() => router.push('/(onboarding)/intro1')}
          >
            <ThemedText style={styles.onboardingButtonText}>Tanıtım Ekranlarını Görüntüle</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.logoutText}>Çıkış Yap</ThemedText>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 8,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingVertical: 36,
    paddingHorizontal: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
    gap: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#4F8CFF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#4F8CFF',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    marginBottom: 8,
    textAlign: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    marginBottom: 2,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: '#4F8CFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  infoSmall: {
    fontSize: 14,
    color: '#7A7D8B',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 2,
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: 18,
    backgroundColor: '#ff3b30',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: '#ff3b30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.1,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  onboardingButton: {
    marginTop: 10,
    backgroundColor: '#4CAF50', // A green color for onboarding button
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
  onboardingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.1,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
}); 