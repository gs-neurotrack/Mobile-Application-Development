// src/screens/Scores/style.ts
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff', // fundo dark NeuroTrack
    paddingHorizontal: 16,
    paddingTop: 16,
  },


  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#80c6ac',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logo: {
    width: 48,
    height: 48,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // SCROLL
  scrollContent: {
    paddingBottom: 24,
  },

  infoText: {
    color: '#e5e7eb',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 20,
  },

  // CARD GENÉRICO (último score / previsões / maior risco)
  card: {
    backgroundColor: '#0b1120',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f9fafb',
    marginBottom: 8,
  },
  cardScoreValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#a5f3fc',
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  cardHint: {
    fontSize: 13,
    color: '#d1d5db',
    lineHeight: 18,
  },

  // CARD DO GRÁFICO
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  chart: {
    borderRadius: 16,
  },
});

export default styles;
