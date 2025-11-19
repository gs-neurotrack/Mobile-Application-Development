import AsyncStorage from '@react-native-async-storage/async-storage';
export const LIMITS_API_URL = 'http://163.176.216.51:5162';

// tipo simplificado que vamos usar no app
export type GsLimit = {
  id: number;
  limitHours: number;
  limitMeetings: number;
};

// tipo do JSON bruto da API
type GsLimitsResponse = {
  items: {
    data: {
      idLimits: number;
      limitHours: number;
      limitMeetings: number;
      createdAt: string;
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


// busca todos os limites
export async function fetchLimits(): Promise<GsLimit[]> {
  const url = `${LIMITS_API_URL}/api/GsLimits`;

  console.log('[GET LIMITS] GET', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const text = await response.text();
  console.log('[GET LIMITS] status', response.status);

  if (!response.ok) {
    throw new Error(`Erro ao buscar limites. Status: ${response.status} - ${text}`);
  }

  const json = JSON.parse(text);

  if (!json.items || !Array.isArray(json.items)) {
    throw new Error('Formato inválido em /api/GsLimits');
  }

  const limits: GsLimit[] = json.items
    .map((item: any) => {
      const h = item.data.limitHours;
      const m = item.data.limitMeetings;

      return {
        id: item.data.idLimits,
        limitHours: h,
        limitMeetings: m,
        label: `${h} hora${h > 1 ? 's' : ''} | ${m} reunião${m > 1 ? 'es' : ''}`,
      };
    })
    .filter((limit: GsLimit) => limit.id >= 21); // mantém apenas os válidos

  return limits;
}
