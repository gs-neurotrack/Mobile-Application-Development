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

gridScroll: {
  paddingHorizontal: 16,
  paddingBottom: 32,
  gap: 16,
  flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',

},


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
  buttonExit:{

    backgroundColor: '#80c6ac',
    borderRadius: 16,
    paddingVertical: 20,
    width: '48%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonTextExit: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },  
card: {
  width: '100%',
  backgroundColor: '#ffffff',
  borderRadius: 12,
  padding: 16,
  marginTop: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
},

cardTitle: {
  fontSize: 16,
  fontWeight: '600',
  color: '#111827',
  marginBottom: 12,
},

meetingsRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},

meetingsButton: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: '#80c6ac',
  alignItems: 'center',
  justifyContent: 'center',
},

meetingsButtonText: {
  color: '#fff',
  fontSize: 20,
  fontWeight: '700',
},

meetingsInput: {
  flex: 1,
  marginHorizontal: 12,
  borderWidth: 1,
  borderColor: '#d1d5db',
  borderRadius: 8,
  paddingHorizontal: 10,
  paddingVertical: 6,
  textAlign: 'center',
  color: '#111827',
},

meetingsHint: {
  marginTop: 8,
  fontSize: 12,
  color: '#6b7280',
},

});
