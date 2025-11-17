import AsyncStorage from '@react-native-async-storage/async-storage';

//IP do meu pc
// const API_URL = 'http://192.168.15.5:8080'; 
const API_URL = 'http://163.176.216.51:8080'; 
// const API_URL = 'http://localhost:8080'; 


type LoginResponse = {
  token: string;  
};

export async function loginApi(email: string, password: string) {

  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      email, 
      password
    }),

  });

  if (!response.ok) {
    throw new Error('Email ou senho inválidos');
  }

  const data: LoginResponse = await response.json();

  
  await AsyncStorage.setItem('token', data.token);
  console.log("TOKEN GERADO:", data.token);

  return data;

}


export async function getToken() {
  return AsyncStorage.getItem('token');
}


export async function logout() {
  await AsyncStorage.removeItem('token');
}


type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  status: string;  
  roleId: number;
  limitsId: number;
};

export async function registerApi(payload: RegisterRequest) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();

  if (!response.ok) {
    console.log('Erro no register:', response.status, text);
    throw new Error('Erro ao cadastrar usuário.');
  }


  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}