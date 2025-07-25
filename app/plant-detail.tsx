import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { supabase } from '@/constants/supabase';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams();
  const [plant, setPlant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [lastWatered, setLastWatered] = useState<string | null>(null);
  const [wateringInterval, setWateringInterval] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPlant = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('plants').select('*').eq('id', id).single();
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setPlant(data);
      setName(data.name);
      setSpecies(data.species || '');
      setLastWatered(data.last_watered || null);
      setWateringInterval(data.watering_interval ? String(data.watering_interval) : '');
      setLoading(false);
    };
    if (id) fetchPlant();
  }, [id]);

  const handleSave = async () => {
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
    const { error: updateError } = await supabase.from('plants').update({
      name,
      species,
      last_watered: lastWatered || null,
      watering_interval: wateringInterval ? Number(wateringInterval) : null,
    }).eq('id', id);
    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    Alert.alert('Başarılı', 'Bitki güncellendi!');
    setEditMode(false);
    router.replace('/');
  };

  // Mobilde date picker onay
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const iso = selectedDate.toISOString().split('T')[0];
      setLastWatered(iso);
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={["#f5f7fa", "#c3cfe2"]} style={styles.gradient}>
        <View style={styles.outerContainer}><ActivityIndicator /></View>
      </LinearGradient>
    );
  }

  if (!plant) {
    return (
      <LinearGradient colors={["#f5f7fa", "#c3cfe2"]} style={styles.gradient}>
        <View style={styles.outerContainer}>
          <ThemedText style={styles.errorText}>Bitki bulunamadı.</ThemedText>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#f5f7fa", "#c3cfe2"]} style={styles.gradient}>
      <View style={styles.outerContainer}>
        <View style={styles.card}>
          <ThemedText style={styles.title}>Bitki Detayı</ThemedText>
          {editMode ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Bitki adı*"
                placeholderTextColor="#C7C9D9"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Türü (opsiyonel)"
                placeholderTextColor="#C7C9D9"
                value={species}
                onChangeText={setSpecies}
              />
              <TextInput
                style={styles.input}
                placeholder="Sulama sıklığı (gün)"
                placeholderTextColor="#C7C9D9"
                value={wateringInterval}
                onChangeText={setWateringInterval}
                keyboardType="numeric"
              />
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
                    default: 'default',
                  })}
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}
              {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
              <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={handleSave}>
                <ThemedText type="defaultSemiBold" style={styles.buttonText}>Kaydet</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} activeOpacity={0.7} onPress={() => setEditMode(false)}>
                <ThemedText style={styles.cancelButtonText}>Vazgeç</ThemedText>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <ThemedText style={styles.detailText}><ThemedText style={styles.detailLabel}>Adı:</ThemedText> {plant.name}</ThemedText>
              {plant.species ? <ThemedText style={styles.detailText}><ThemedText style={styles.detailLabel}>Türü:</ThemedText> {plant.species}</ThemedText> : null}
              {plant.last_watered ? <ThemedText style={styles.detailText}><ThemedText style={styles.detailLabel}>Son sulama:</ThemedText> {plant.last_watered}</ThemedText> : null}
              {plant.watering_interval ? <ThemedText style={styles.detailText}><ThemedText style={styles.detailLabel}>Sulama sıklığı:</ThemedText> Her {plant.watering_interval} günde bir</ThemedText> : null}
              <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={() => setEditMode(true)}>
                <ThemedText type="defaultSemiBold" style={styles.buttonText}>Düzenle</ThemedText>
              </TouchableOpacity>
            </>
          )}
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
    fontSize: 26,
    fontWeight: '700',
    color: Colors.light.primary,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    marginBottom: 18,
    textAlign: 'center',
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
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif', // Adding inputFont styling directly here
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
  detailText: {
    fontSize: 17,
    color: Colors.light.text,
    marginBottom: 6,
    textAlign: 'center',
  },
  detailLabel: {
    color: Colors.light.primary,
    fontWeight: '700',
    fontSize: 17,
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
  cancelButton: {
    width: '100%',
    backgroundColor: Colors.light.tabIconDefault,
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 6,
  },
  cancelButtonText: {
    color: Colors.light.cardBackground,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.1,
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
