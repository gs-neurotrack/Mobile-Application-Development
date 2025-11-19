// src/pages/Login/style.js
import { StyleSheet } from 'react-native';
const PRIMARIA = "#80c6ac";  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#F8FAFC", 
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: PRIMARIA,
  },
  button: {
    backgroundColor: PRIMARIA,
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logo: {
    width: 220,
    height: 220,
  },
  text_message: {
    fontSize: 15,
    marginBottom: 40,
    color: PRIMARIA,
  },
  titleDate: {
    marginBottom: 15,
    marginTop: 20,
    color: PRIMARIA,
    fontSize: 30,
    fontWeight: 'bold',
  },
  bgModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectButton: {
    borderWidth: 1,
    borderColor: '#80c6ac',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  optionsSelect: {
    width: '80%',
    maxHeight: '60%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  titleOptions: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  flatListItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  buttonCancel: {
    marginTop: 12,
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  textCancel: { 
    color: '#80c6ac', 
    fontWeight: 'bold' 
  },
});

export default styles;