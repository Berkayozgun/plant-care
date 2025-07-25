import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { supabase } from '@/constants/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';


export default function Intro3Screen() {
  const router = useRouter();

  const completeOnboarding = async () => {
    await AsyncStorage.setItem('onboardingCompleted', 'true');
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      router.replace('/(tabs)'); // If already logged in, go to main tabs
    } else {
      router.replace('/login'); // Otherwise, go to login
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Place for an image */}
      <Image
        source={{ uri: 'https://image.milimaj.com/i/milliyet/75/0x0/60af5a5d5542840210ddb8a6.jpg' }} // Placeholder image, you can replace this
        style={styles.image}
      />
      
      <ThemedText type="title" style={styles.title}>Hatırlatıcılar Alın</ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>Bitkilerinizi ne zaman sulayacağınızı veya gübreleyeceğinizi asla unutmayın.</ThemedText>
      <TouchableOpacity
        onPress={completeOnboarding}
        style={styles.button}
        activeOpacity={0.7}
      >
        <ThemedText style={styles.buttonText}>Başlayın</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  image: {
    width: 200, // Adjust as needed
    height: 200, // Adjust as needed
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.light.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 30,
    color: Colors.light.text,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.light.primary,
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginTop: 50,
  },
  buttonText: {
    color: Colors.light.cardBackground,
    fontSize: 18,
    fontWeight: 'bold',
  },
});