// src/services/gsDailyLogsService.ts
import { usageTracker } from './usageTracker';

const CSHARP_API_URL = 'http://163.176.216.51:5162';

type GsDailyLogRequest = {
  idLog: number;
  workHours: number;
  meetings: number;
  logDate: string; // pode ser ignorado pelo backend se ele gerar
  idUser: number;
};

export async function sendDailyLogToCSharp() {
  const data = usageTracker.buildDailyLogForCSharp();

  if (!data) {
    console.log('[GsDailyLogs] Nenhuma sessão ativa para registrar.');
    return;
  }

  const nowIso = new Date().toISOString();

  const payload: GsDailyLogRequest = {
    idLog: 0, // backend deve ignorar e gerar o próprio ID
    workHours: data.workHoursExtra,  // 👈 horas além das 8h
    meetings: data.meetings,
    logDate: nowIso,                 // você comentou que a API gera a data;
                                     // se ela não usar esse campo, tudo bem.
    idUser: data.idUser,
  };

  console.log('[GsDailyLogs] Enviando payload:', payload);

  const response = await fetch(`${CSHARP_API_URL}/api/GsDailyLogs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  console.log('[GsDailyLogs] Resposta:', response.status, text);

  if (!response.ok) {
    throw new Error(
      `Erro ao salvar log diário na API C#: ${response.status} - ${text}`,
    );
  }
}
