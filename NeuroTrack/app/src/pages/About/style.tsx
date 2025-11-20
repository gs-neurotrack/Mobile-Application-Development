// src/screens/About/style.ts
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
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
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffffff',
  },
  subtitle: {
    fontSize: 12,
    color: '#ffffffff',
    marginTop: 2,
  },

  scrollContent: {
    paddingBottom: 24,
  },

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
  cardText: {
    fontSize: 14,
    color: '#e5e7eb',
    lineHeight: 20,
    marginBottom: 4,
  },
  highlight: {
    color: '#80c6ac',
    fontWeight: '600',
  },
  bullet: {
    fontSize: 14,
    color: '#e5e7eb',
    lineHeight: 20,
    marginLeft: 4,
  },

  cardInfo: {
    backgroundColor: '#022c22',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#16a34a',
  },
  cardInfoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#bbf7d0',
    marginBottom: 6,
  },
  cardInfoText: {
    fontSize: 13,
    color: '#dcfce7',
    lineHeight: 19,
  },
});

export default styles;
