import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_URL = 'http://192.168.15.5:8080';
const API_URL = 'http://163.176.216.51:8080';
// const API_URL = 'http://localhost:8080';

export async function apiGet(path: string) {

  const token = await AsyncStorage.getItem('token');

  const response = await fetch(`${API_URL}${path}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    
  });

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`);
  }

  return response.json();
}
