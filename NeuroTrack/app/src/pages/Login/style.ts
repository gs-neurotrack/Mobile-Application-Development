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
    width: 330,
    height: 220,
  },
  rememberMeContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center', 
    marginBottom: 12, 
    justifyContent: 'space-between'
  },
  textRememberMe: {
    color: '#334155',
  },
  text_message: {
    fontSize: 15,
    marginBottom: 40,
    color: PRIMARIA,
  },
});

export default styles;