// src/services/predictionsService.ts
import { getAuthHeaders, getLoggedUserId } from './authService';

const PREDICTIONS_API_BASE_URL = 'http://163.176.216.51:5162/api';

export interface Prediction {
  idPrediction: number;
  idUser: number;
  idScores: number;
  stressPredicted: number;
  message: string;
  datePredicted: string;
  idStatusRisk: number;
}


type PredictionsSearchApiResponse = {
  items: {
    data: {
      idPrediction: number;
      stressPredicted: number;
      message: string;
      datePredicted: string;
      idUser: number;
      idScores: number;
      idStatusRisk: number;
    };
    _links: any[];
  }[];
  pageInfo: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  _links: any[];
};


export async function fetchPredictionsForUser(idUser: number): Promise<Prediction[]> {
  if (!idUser || Number.isNaN(idUser)) {
    throw new Error('ID do usuário inválido para buscar predições.');
  }

  const headers = await getAuthHeaders({
    Accept: 'application/json',
  });

  const url = `${PREDICTIONS_API_BASE_URL}/GsPredictions/search?idUser=${idUser}&sortBy=idPrediction&sortDir=asc`;

  console.log('[predictionsService] GET', url);

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  const text = await response.text();
  console.log('[predictionsService] status', response.status, 'body:', text);

  if (response.status === 401 || response.status === 403) {
    throw new Error('Usuário não autenticado');
  }

  if (!response.ok) {
    throw new Error(
      `Erro ao buscar predições no servidor. Status: ${response.status} - ${text}`,
    );
  }

  let json: PredictionsSearchApiResponse;
  try {
    json = JSON.parse(text);
  } catch (e) {
    console.error('[predictionsService] erro ao parsear JSON:', e);
    throw new Error('Erro ao interpretar resposta da API de predições.');
  }

  if (!Array.isArray(json.items)) {
    console.warn('[predictionsService] json.items não é um array:', json);
    return [];
  }

  const mapped: Prediction[] = json.items.map((item) => {
    const d = item.data;

    return {
      idPrediction: d.idPrediction,
      idUser: d.idUser,
      idScores: d.idScores,
      stressPredicted: Number(d.stressPredicted ?? 0),
      message: d.message ?? '',
      datePredicted: d.datePredicted ?? new Date().toISOString(),
      idStatusRisk: d.idStatusRisk,
    };
  });

  console.log('[predictionsService] mapped predictions:', mapped);

  return mapped;
}


export async function fetchPredictionsForLoggedUser(): Promise<Prediction[]> {
  const idUser = await getLoggedUserId();
  if (!idUser) {
    throw new Error('Usuário não autenticado (ID do usuário não encontrado).');
  }
  return fetchPredictionsForUser(idUser);
}
