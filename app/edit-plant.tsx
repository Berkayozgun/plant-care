import { ScreenLayout } from '@/components/ScreenLayout';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { supabase } from '@/constants/supabase';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditPlantScreen() {
  const { id } = useLocalSearchParams();
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [lastWatered, setLastWatered] = useState<string | null>(null);
  const [wateringInterval, setWateringInterval] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      const fetchPlant = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from('plants')
          .select('*')
          .eq('id', id)
          .single();
        setLoading(false);
        if (error) {
          setError(error.message);
        } else if (data) {
          setName(data.name);
          setSpecies(data.species || '');
          setLastWatered(data.last_watered);
          setWateringInterval(data.watering_interval?.toString() || '');
        }
      };
      fetchPlant();
    }
  }, [id]);

  const handleUpdatePlant = async () => {
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
    const { error: updateError } = await supabase
      .from('plants')
      .update({
        name,
        species,
        last_watered: lastWatered || null,
        watering_interval: wateringInterval ? Number(wateringInterval) : null,
      })
      .eq('id', id);
    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    Alert.alert('Başarılı', 'Bitki güncellendi!');
    router.replace('/');
  };

  const handleDeletePlant = async () => {
    Alert.alert(
      'Bitkiyi Sil',
      'Bu bitkiyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            const { error: deleteError } = await supabase.from('plants').delete().eq('id', id);
            setLoading(false);
            if (deleteError) {
              setError(deleteError.message);
            } else {
              Alert.alert('Başarılı', 'Bitki silindi!');
              router.replace('/');
            }
          },
        },
      ]
    );
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const iso = selectedDate.toISOString().split('T')[0];
      setLastWatered(iso);
    }
  };

  return (
    <ScreenLayout>
      <View style={styles.card}>
        <ThemedText style={styles.title}>Bitkiyi Düzenle</ThemedText>
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
        <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={handleUpdatePlant} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MaterialCommunityIcons name="content-save" size={20} color="#fff" />
              <ThemedText type="defaultSemiBold" style={styles.buttonText}>Güncelle</ThemedText>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} activeOpacity={0.85} onPress={handleDeletePlant} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MaterialCommunityIcons name="delete" size={20} color="#fff" />
              <ThemedText type="defaultSemiBold" style={[styles.buttonText, styles.deleteButtonText]}>Sil</ThemedText>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </ScreenLayout>
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
    fontFamily: Platform.select({
      ios: 'System',
      default: 'sans-serif',
    }),
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
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
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
  deleteButton: {
    backgroundColor: '#ff3b30',
    shadowColor: '#ff3b30',
  },
  buttonText: {
    color: Colors.light.cardBackground,
    fontSize: 17,
    fontFamily: Platform.select({
      ios: 'System',
      default: 'sans-serif',
    }),
  },
  deleteButtonText: {
    color: Colors.light.cardBackground,
    fontFamily: Platform.select({
      ios: 'System',
      default: 'sans-serif',
    }),
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 2,
    textAlign: 'center',
  },
});