import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { supabase } from '@/constants/supabase';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddPlantScreen() {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [lastWatered, setLastWatered] = useState<string | null>(null);
  const [wateringInterval, setWateringInterval] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAddPlant = async () => {
    setError(null);
    if (!name) {
      setError('Bitki adı zorunludur.');
      return;
    }
    if (wateringInterval && isNaN(Number(wateringInterval))) {
      setError('Sulama sıklığı sayı olmalı.');
      return;
    }
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
      setLoading(false);
      return;
    }
    const { error: insertError } = await supabase.from('plants').insert({
      user_id: user.id,
      name,
      species,
      last_watered: lastWatered || null,
      watering_interval: wateringInterval ? Number(wateringInterval) : null,
    });
    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    Alert.alert('Başarılı', 'Bitki eklendi!');
    router.replace('/');
  };

  // Web için fallback
  const handleWebDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastWatered(e.target.value || null);
  };

  // Mobilde date picker onay
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const iso = selectedDate.toISOString().split('T')[0];
      setLastWatered(iso);
    }
  };

  return (
    <LinearGradient colors={["#f5f7fa", "#c3cfe2"]} style={styles.gradient}>
      <View style={styles.card}>
        <ThemedText style={styles.title}>Bitki Ekle</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Bitki adı*"
          placeholderTextColor={Colors.light.text}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Türü (opsiyonel)"
          placeholderTextColor={Colors.light.text}
          value={species}
          onChangeText={setSpecies}
        />
        <TextInput
          style={styles.input}
          placeholder="Sulama sıklığı (gün)"
          placeholderTextColor={Colors.light.text}
          value={wateringInterval}
          onChangeText={setWateringInterval}
          keyboardType="numeric"
        />
        {Platform.OS === 'web' ? (
          <input
            type="date"
            value={lastWatered || ''}
            onChange={handleWebDateChange}
            style={{
              width: '100%',
              padding: 16,
              borderRadius: 16,
              border: 'none',
              backgroundColor: Colors.light.inputBackground,
              fontSize: 16,
              marginBottom: 12,
              fontFamily: Platform.select({
                ios: 'System',
                default: 'sans-serif',
              }),
              color: Colors.light.text,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          />
        ) : (
          <>
            <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
              <ThemedText style={lastWatered ? styles.dateText : styles.datePlaceholder}>
                {lastWatered ? `Son sulama: ${lastWatered}` : 'Son sulama tarihi (opsiyonel)'}
              </ThemedText>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={lastWatered ? new Date(lastWatered) : new Date()}
                mode="date"
                display={Platform.select({
                  ios: 'spinner',
                  android: 'default',
                  default: 'default', // Fallback for web and other platforms
                })}
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
          </>
        )}
        {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
        <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={handleAddPlant} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>Kaydet</ThemedText>
          )}
        </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.primary,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    marginBottom: 10,
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
  dateInput: {
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
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  datePlaceholder: {
    fontSize: 16,
    color: Colors.light.text,
  },
  button: {
    width: '100%',
    backgroundColor: Colors.light.primary,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
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
}); 