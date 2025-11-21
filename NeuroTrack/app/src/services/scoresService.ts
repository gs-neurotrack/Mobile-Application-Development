// src/services/scoresService.ts
import { getAuthHeaders, getLoggedUserId } from './authService';

const SCORES_API_BASE_URL = 'http://163.176.216.51:5162/api';

export interface UserScore {
  idScores: number;
  idUser: number;
  scoreValue: number;
  dateScore?: string | null;
  createdAt: string;
  timeRecommendation?: number | null;
  idStatusRisk?: number | null;
  idLog?: number | null;
}


type ScoresSearchApiResponse = {
  items: {
    data: {
      idScores: number;
      dateScore: string;
      scoreValue: number;
      timeRecommendation: number;
      createdAt: string;
      idStatusRisk: number;
      idUser: number;
      idLog: number;
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

export async function fetchScoresForLoggedUser(): Promise<UserScore[]> {
  const idUser = await getLoggedUserId();

  console.log('[scoresService] idUser logado:', idUser);

  if (!idUser) {
    throw new Error('Usuário não autenticado (ID do usuário não encontrado).');
  }

  const headers = await getAuthHeaders({
    Accept: 'application/json',
  });

  const url = `${SCORES_API_BASE_URL}/GsScores/search?idUser=${idUser}&sortBy=idScores&sortDir=asc`;

  console.log('[scoresService] GET', url);

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  const text = await response.text();
  console.log('[scoresService] status', response.status, 'body:', text);

  if (response.status === 401 || response.status === 403) {
    throw new Error('Usuário não autenticado');
  }

  if (!response.ok) {
    throw new Error(
      `Erro ao buscar scores no servidor. Status: ${response.status} - ${text}`,
    );
  }

  let json: ScoresSearchApiResponse;
  try {
    json = JSON.parse(text);
  } catch (e) {
    console.error('[scoresService] erro ao parsear JSON:', e);
    throw new Error('Erro ao interpretar resposta da API de scores.');
  }

  if (!Array.isArray(json.items)) {
    console.warn('[scoresService] json.items não é um array:', json);
    return [];
  }


  const mapped: UserScore[] = json.items.map((item) => {
    const d = item.data;

    return {
      idScores: d.idScores,
      idUser: d.idUser,
      scoreValue: Number(d.scoreValue ?? 0),
      dateScore: d.dateScore ?? null,
      createdAt: d.createdAt ?? d.dateScore ?? new Date().toISOString(),
      timeRecommendation: d.timeRecommendation ?? null,
      idStatusRisk: d.idStatusRisk ?? null,
      idLog: d.idLog ?? null,
    };
  });

  console.log('[scoresService] mapped scores:', mapped);

  return mapped;
}
