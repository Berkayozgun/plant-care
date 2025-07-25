import { View, StyleSheet, TextInput, Alert, TouchableOpacity, Platform } from 'react-native';
import React, { useState } from 'react';
import { supabase } from '@/constants/supabase';
import { Stack, useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      router.replace('/(tabs)');
    }
    setLoading(false);
  }

  return (
    <LinearGradient colors={["#f5f7fa", "#c3cfe2"]} style={styles.gradient}>
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <ThemedText style={styles.title}>Plant Care</ThemedText>
        <ThemedText style={styles.subtitle}>Giriş Yap</ThemedText>

        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="E-posta"
            autoCapitalize={'none'}
            style={styles.input}
            placeholderTextColor="#7A7D8B"
          />
          <TextInput
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Şifre"
            autoCapitalize={'none'}
            style={styles.input}
            placeholderTextColor="#7A7D8B"
          />
        </View>

        <TouchableOpacity
          onPress={signInWithEmail}
          disabled={loading}
          style={styles.button}
          activeOpacity={0.85}
        >
          <ThemedText type="defaultSemiBold" style={styles.buttonText}>Giriş Yap</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/register')}
          style={styles.registerButton}
        >
          <ThemedText style={styles.registerButtonText}>Hesabın yok mu? Kayıt Ol</ThemedText>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4F8CFF',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#7A7D8B',
    fontWeight: '600',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    fontSize: 16,
    color: '#222',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  button: {
    backgroundColor: '#4F8CFF',
    padding: 16,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#4F8CFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  registerButton: {
    marginTop: 10,
  },
  registerButtonText: {
    color: '#4F8CFF',
    fontSize: 16,
    fontWeight: '600',
  },
});