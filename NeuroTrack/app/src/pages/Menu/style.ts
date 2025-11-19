import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },


  header: {
    backgroundColor: '#80c6ac',
    paddingVertical: 25,
    alignItems: 'center',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    marginBottom: 25,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
  },
  logo: {
    width: 330,
    height: 220,
  },

  // GRID
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    color: '#000',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
  },
  modalError: {
    marginTop: 8,
    color: '#E53935',
    fontSize: 13,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 18,
    gap: 10,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  modalButtonCancel: {
    backgroundColor: '#e5e5e5',
  },
  modalButtonConfirm: {
    backgroundColor: '#80c6ac',
  },
  modalButtonTextCancel: {
    color: '#333',
    fontWeight: '600',
  },
  modalButtonTextConfirm: {
    color: '#fff',
    fontWeight: '700',
  },
});
