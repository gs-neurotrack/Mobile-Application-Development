import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // 🔹 Header
  header: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    backgroundColor: '#80c6ac', // cor combinando com seus botões
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // 🔹 Mensagem de erro
  errorText: {
    color: '#E53935',
    marginTop: 8,
    marginHorizontal: 20,
    fontSize: 14,
  },

  // 🔹 Lista
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  // 🔹 Card de usuário
  userCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },

  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },

  userRole: {
    marginTop: 4,
    fontSize: 14,
    color: '#555',
  },

  // 🔹 Lista vazia
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
    paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 8,
  },
  paginationButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#0b1120',
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  paginationButtonDisabled: {
    backgroundColor: '#111827',
    borderColor: '#4b5563',
  },
  paginationButtonText: {
    color: '#e5e7eb',
    fontSize: 14,
    fontWeight: '600',
  },
  paginationButtonTextDisabled: {
    color: '#9ca3af',
  },
  paginationInfo: {
    color: '#e5e7eb',
    fontSize: 14,
  },

});

export default styles;