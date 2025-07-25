import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { supabase } from '@/constants/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async () => {
    setError(null);
    if (!name || !email || !password || !passwordRepeat) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }
    if (password !== passwordRepeat) {
      setError('Şifreler eşleşmiyor.');
      return;
    }
    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    Alert.alert('Başarılı', 'Kayıt başarılı! Lütfen e-posta adresinizi doğrulayın.');
    router.replace('/login');
  };

  return (
    <LinearGradient colors={["#f5f7fa", "#c3cfe2"]} style={styles.gradient}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.card}>
        <View style={styles.appNameContainer}>
          <ThemedText style={styles.appName}>Plant Care</ThemedText>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Ad Soyad"
          placeholderTextColor={Colors.light.text}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="E-posta"
          placeholderTextColor={Colors.light.text}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          placeholderTextColor={Colors.light.text}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="newPassword"
        />
        <TextInput
          style={styles.input}
          placeholder="Şifre Tekrar"
          placeholderTextColor={Colors.light.text}
          value={passwordRepeat}
          onChangeText={setPasswordRepeat}
          secureTextEntry
          textContentType="newPassword"
        />
        {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
        <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={handleRegister} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>Kayıt Ol</ThemedText>
          )}
        </TouchableOpacity>
        <View style={styles.bottomLinks}>
          <ThemedText style={styles.bottomText}>Zaten hesabın var mı?</ThemedText>
          <Pressable onPress={() => router.replace('/login')}>
            <ThemedText type="link" style={styles.loginText}> Giriş yap</ThemedText>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    maxWidth: 380,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 28,
    paddingVertical: 36,
    paddingHorizontal: 28,
    alignItems: 'center',
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
    gap: 16,
  },
  appNameContainer: {
    marginBottom: 18,
    width: '100%',
    alignItems: 'center',
  },
  appName: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.light.primary,
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: 'System',
      default: 'sans-serif',
    }),
  },
  input: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: Colors.light.inputBackground,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  button: {
    backgroundColor: Colors.light.primary,
    padding: 16,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 10,
  },
  buttonText: {
    color: Colors.light.cardBackground,
    fontSize: 17,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 2,
    textAlign: 'center',
  },
  bottomLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 2,
  },
  bottomText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  loginText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '600',
  },
}); 