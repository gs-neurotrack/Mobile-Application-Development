import AsyncStorage from '@react-native-async-storage/async-storage';
import { usageTracker } from '../services/usageTracker';

export const API_URL = 'http://163.176.216.51:8080';


export type LoginResponseRaw = {
  token?: string;
  accessToken?: string;
  jwt?: string;
  id?: number;
  userId?: number;
  userID?: number;
  [key: string]: any;
};

export type Role = {
  id: number;
  name: string;
};

export type Limits = {
  id: number;
  limitHours: number;
  limitMeetings: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  status: string;

  roleId?: number;
  limitsId?: number;

  role?: Role;
  limits?: Limits;

  credentialsNonExpired?: boolean;
  authorities?: { authority: string }[];
  accountNonExpired?: boolean;
  accountNonLocked?: boolean;
  username?: string;
  enabled?: boolean;
};

export type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
};


export async function loginApi(email: string, password: string) {
  console.log('[LOGIN] POST', `${API_URL}/auth/login`);

  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const text = await response.text();
  console.log('[LOGIN] status:', response.status, 'body:', text);

  if (!response.ok) {
    throw new Error('Email ou senha inválidos.');
  }

  const data = JSON.parse(text);

  const token =
    data.token ?? data.accessToken ?? data.jwt ?? data.idToken;

  if (!token) {
    throw new Error('Token não encontrado na resposta da API.');
  }

  await AsyncStorage.setItem('accessToken', token);
  await AsyncStorage.setItem('userEmail', email);

  if (data.id) {
    await AsyncStorage.setItem('userId', String(data.id));
    usageTracker.startSession(data.id);
    console.log('[LOGIN] ID SALVO:', data.id);
  } else {
    console.log('[LOGIN] API não enviou ID!');
  }

  console.log('[LOGIN] TOKEN SALVO:', token.slice(0, 15) + '...');

  return data;
}



export async function getToken() {
  return AsyncStorage.getItem('accessToken');
}

export async function getLoggedEmail() {
  return AsyncStorage.getItem('userEmail');
}

export async function getLoggedUserId() {
  const id = await AsyncStorage.getItem('userId');
  return id ? Number(id) : null;
}

export async function logout() {
  await AsyncStorage.multiRemove(['accessToken', 'userEmail', 'userId']);
}

export async function getAuthHeaders(extra?: Record<string, string>) {
  const token = await getToken();

  if (!token) {
    console.log('[AUTH] Token não encontrado no AsyncStorage');
    throw new Error('Usuário não autenticado (token não encontrado).');
  }

  console.log(
    '[AUTH] Usando token (primeiros 20 chars):',
    token.slice(0, 20) + '...',
  );

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...(extra || {}),
  };
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
  console.log('[REGISTER] POST', `${API_URL}/auth/register`, payload);

  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  console.log('[REGISTER] status', response.status, 'body:', text);

  if (!response.ok) {
    throw new Error(`Erro ao cadastrar usuário. Status: ${response.status} - ${text}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}


export async function getUserById(id?: number): Promise<User> {
  const loggedId = id ?? (await getLoggedUserId());

  if (!loggedId) {
    throw new Error('ID do usuário não encontrado (faça login novamente).');
  }

  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/api/v1/user/${loggedId}`,
    {
      method: 'GET',
      headers,
    }
  );

  const text = await response.text();
  console.log('[GET USER BY ID] status', response.status, 'body:', text);

  if (!response.ok) {
    throw new Error(`Erro ao carregar dados do usuário. Status: ${response.status} - ${text}`);
  }

  return JSON.parse(text) as User;
}



export async function updateUserById(user: User): Promise<User> {
  if (user.id == null) {
    throw new Error('ID do usuário não informado para atualização.');
  }

  const headers = await getAuthHeaders();

  const { password, ...userWithoutPassword } = user;

  const response = await fetch(
    `${API_URL}/api/v1/user/${user.id}`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify(userWithoutPassword),
    }
  );

  const text = await response.text();
  console.log('[PUT USER BY ID] status', response.status, 'body:', text);

  if (!response.ok) {
    throw new Error(`Erro ao atualizar dados do usuário. Status: ${response.status} - ${text}`);
  }

  return JSON.parse(text) as User;
}



export async function deleteUserById(id?: number): Promise<void> {
  const loggedId = id ?? (await getLoggedUserId());

  if (!loggedId) {
    throw new Error('ID do usuário não encontrado (faça login novamente).');
  }

  const headers = await getAuthHeaders();

  const url = `${API_URL}/api/v1/user/${loggedId}`;
  console.log('[DELETE USER BY ID] DELETE', url);

  const response = await fetch(url, {
    method: 'DELETE',
    headers,
  });

  const text = await response.text();
  console.log('[DELETE USER BY ID] status', response.status, 'body:', text);

  if (!response.ok) {
    throw new Error(`Erro ao excluir usuário. Status: ${response.status} - ${text}`);
  }
}


export async function fetchUsersPage(
  page: number = 0,
  size: number = 5
): Promise<Page<User>> {
  const headers = await getAuthHeaders();

  const url = `${API_URL}/api/v1/user?pagina=${page}&itens=${size}`;

  console.log('[GET USERS PAGE] GET', url);

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  const text = await response.text();
  console.log('[GET USERS PAGE] status', response.status, 'body:', text);

  if (!response.ok) {
    throw new Error(`Erro ao buscar usuários. Status: ${response.status} - ${text}`);
  }

  const data: Page<User> = JSON.parse(text);
  return data;
}
