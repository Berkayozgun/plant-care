import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { supabase } from '@/constants/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

// Bitki tipi
 type Plant = {
  id: string;
  name: string;
  species: string;
  last_watered: string | null;
  created_at: string;
};

function formatDateTR(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function HomeScreen() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchPlants = async () => {
    setLoading(true);
    setError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) {
      setError(error.message);
      setPlants([]);
    } else {
      setPlants(data as Plant[]);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchPlants();
    }, [])
  );

  const renderPlant = ({ item }: { item: Plant }) => (
    <TouchableOpacity style={styles.plantCard} onPress={() => router.push(`/plant-detail?id=${item.id}`)}>
      <View style={styles.cardRow}>
        <View style={styles.iconContainer}>
          <Image source={require('@/assets/image.png')} style={styles.plantImage} />
        </View>
        <View style={styles.cardContent}>
          <ThemedText style={styles.plantName}>{item.name}</ThemedText>
          {item.species ? <ThemedText style={styles.plantSpecies}>{item.species}</ThemedText> : null}
          {item.last_watered ? (
            <ThemedText style={styles.plantInfo}>Son sulama: {formatDateTR(item.last_watered)}</ThemedText>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={["#f5f7fa", "#c3cfe2"]} style={styles.gradient}>
      <View style={styles.container}>
        <ThemedText style={styles.title}>Bitkilerim</ThemedText>
        {loading ? (
          <ActivityIndicator style={{ marginTop: 40 }} />
        ) : error ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>{error}</ThemedText>
            <TouchableOpacity onPress={() => router.replace('/login')} style={styles.loginButton}>
              <ThemedText style={styles.loginButtonText}>Giriş Yap</ThemedText>
            </TouchableOpacity>
          </View>
        ) : plants.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>Henüz hiç bitki eklemediniz.</ThemedText>
            <ThemedText style={styles.emptySubText}>Bitkilerinizi ekleyin ve bakım hatırlatmaları alın!</ThemedText>
          </View>
        ) : (
          <FlatList
            data={plants}
            renderItem={renderPlant}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
        )}
        <TouchableOpacity style={styles.addButton} activeOpacity={0.85} onPress={() => router.push('/add-plant')}>
          <ThemedText type="defaultSemiBold" style={styles.addButtonText}>+ Bitki Ekle</ThemedText>
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
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 18,
    gap: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#4F8CFF',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    marginBottom: 10,
  },
  emptyContainer: {
    marginTop: 40,
    alignItems: 'center',
    gap: 6,
  },
  emptyText: {
    fontSize: 18,
    color: '#7A7D8B',
    fontWeight: '600',
  },
  emptySubText: {
    fontSize: 15,
    color: '#A0A3B0',
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  loginButtonText: {
    color: Colors.light.cardBackground,
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    gap: 12,
    paddingBottom: 80,
  },
  plantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
    marginBottom: 14,
    alignSelf: 'center',
    gap: 2,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 14,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    shadowColor: '#4F8CFF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  plantImage: {
    width: 32, // Adjust size as needed
    height: 32, // Adjust size as needed
    resizeMode: 'contain',
  },
  cardContent: {
    flex: 1,
    gap: 2,
  },
  plantName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    marginBottom: 2,
  },
  plantSpecies: {
    fontSize: 15,
    color: '#4F8CFF',
    fontWeight: '500',
    marginBottom: 1,
  },
  plantInfo: {
    fontSize: 13,
    color: '#7A7D8B',
    marginTop: 2,
  },
  addButton: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    marginHorizontal: 24,
    backgroundColor: '#4F8CFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#4F8CFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
});
