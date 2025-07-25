import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

const categories = [
  {
    title: 'Genel Bitki Bakımı',
    icon: 'local-florist',
    tips: [
      'Bitkilerinizi düzenli aralıklarla kontrol edin ve yapraklarını temizleyin.',
      'Bitkilerinizi aşırı sulamaktan kaçının, toprağın üstü kuruduğunda sulayın.',
      'Bitkilerinizi zaman zaman döndürerek her tarafının eşit ışık almasını sağlayın.',
    ],
  },
  {
    title: 'Sulama',
    icon: 'water-drop',
    tips: [
      'Her bitkinin su ihtiyacı farklıdır. Türüne göre sulama sıklığını belirleyin.',
      'Sabah veya akşam saatlerinde sulama yapmak, suyun buharlaşmasını azaltır.',
      'Sulama suyunun oda sıcaklığında olmasına dikkat edin.',
      'Saksı altındaki tabağı fazla sudan arındırın, kök çürümesini önleyin.',
    ],
  },
  {
    title: 'Işık',
    icon: 'wb-sunny',
    tips: [
      'Bitkilerinizi doğrudan güneş ışığına maruz bırakmayın, filtrelenmiş ışık idealdir.',
      'Işık yetersizse bitkiniz cılız ve solgun görünebilir.',
      'Kış aylarında bitkilerinizi pencereye daha yakın konumlandırabilirsiniz.',
    ],
  },
  {
    title: 'Toprak ve Saksı',
    icon: 'grass',
    tips: [
      'Bitkinizin türüne uygun toprak seçin. Kaktüs ve sukulentler için geçirgen toprak tercih edin.',
      'Saksı değişimini ilkbaharda yapın, kökleri fazla rahatsız etmeyin.',
      'Saksı altında drenaj delikleri olmasına dikkat edin.',
    ],
  },
  {
    title: 'Gübreleme',
    icon: 'science',
    tips: [
      'Bahar ve yaz aylarında bitkilerinize uygun sıvı gübre kullanın.',
      'Aşırı gübrelemeden kaçının, kök yanıklarına sebep olabilir.',
      'Kışın bitkiler genellikle dinlenme dönemindedir, gübrelemeye ara verin.',
    ],
  },
  {
    title: 'Hastalıklar ve Zararlılar',
    icon: 'bug-report',
    tips: [
      'Yapraklarda lekeler, böcekler veya yapışkanlık fark ederseniz bitkinizi izole edin.',
      'Doğal sabunlu su veya neem yağı ile zararlılara karşı mücadele edebilirsiniz.',
      'Hastalık ilerlerse profesyonel destek alın.',
    ],
  },
  {
    title: 'Popüler Bitki Türleri',
    icon: 'eco',
    tips: [
      'Areka Palmiyesi: Havadar ortam ve filtrelenmiş ışık sever.',
      'Barış Çiçeği: Yarı gölge ve nemli toprak idealdir.',
      'Kaktüs & Sukulent: Az su, bol ışık ister.',
      'Salon Sarmaşığı: Yarı gölge, düzenli sulama ve nemli ortamı sever.',
    ],
  },
];

export default function ExploreScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText style={styles.title}>Keşfet</ThemedText>
      <ThemedText style={styles.subtitle}>Bitki Bakımı Hakkında Kategorize Bilgiler</ThemedText>
      <View style={styles.categoriesList}>
        {categories.map((cat, idx) => (
          <View key={idx} style={[styles.categoryCard, { backgroundColor: idx % 2 === 0 ? '#F7FAFF' : '#FFF' }]}> 
            <View style={styles.categoryHeader}>
              <IconSymbol name={cat.icon as any} size={28} color="#4F8CFF" />
              <ThemedText style={styles.categoryTitle}>{cat.title}</ThemedText>
            </View>
            <View style={styles.tipsList}>
              {cat.tips.map((tip, tipIdx) => (
                <View key={tipIdx} style={styles.tipRow}>
                  <ThemedText style={styles.bullet}>•</ThemedText>
                  <ThemedText style={styles.tipText}>{tip}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: 8,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#4F8CFF',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#7A7D8B',
    fontWeight: '600',
    marginBottom: 18,
    textAlign: 'center',
  },
  categoriesList: {
    width: '100%',
    maxWidth: 420,
    gap: 18,
  },
  categoryCard: {
    borderRadius: 18,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 8,
    gap: 10,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#4F8CFF',
  },
  tipsList: {
    gap: 4,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  bullet: {
    fontSize: 18,
    color: '#4F8CFF',
    marginRight: 6,
    marginTop: 1,
  },
  tipText: {
    fontSize: 15,
    color: '#222',
    flex: 1,
    flexWrap: 'wrap',
  },
});
