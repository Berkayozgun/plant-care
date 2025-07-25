import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { Platform, StyleSheet, ScrollView } from 'react-native';

export default function TipDetailScreen() {
  const { title, desc, category } = useLocalSearchParams();

  return (
    <LinearGradient colors={["#f5f7fa", "#c3cfe2"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        {category && <ThemedText style={styles.category}>Kategori: {category}</ThemedText>}
        <ThemedText style={styles.description}>{desc}</ThemedText>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.light.primary,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    marginBottom: 10,
    textAlign: 'center',
  },
  category: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: '600',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
    textAlign: 'justify',
  },
});
