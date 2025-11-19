// src/services/pythonApi.ts
import { usageTracker } from './usageTracker';

const PYTHON_API_URL = 'http://163.176.216.51:8000'; // ajuste se for outra porta

export async function sendUsageToPython() {
  const payload = usageTracker.buildPayload();

  if (!payload) {
    console.log('[PythonAPI] Nenhuma sessão ativa para enviar.');
    return;
  }

  console.log('[PythonAPI] Enviando payload:', payload);

  const response = await fetch(`${PYTHON_API_URL}/logs`, {
    // coloque o path da sua rota FastAPI (ex: /mobile/logs, /usage, etc)
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  console.log('[PythonAPI] Resposta:', response.status, text);

  if (!response.ok) {
    throw new Error(`Erro ao enviar dados de uso para Python: ${response.status} - ${text}`);
  }

  // se deu tudo certo, podemos resetar a sessão
  usageTracker.reset();
}
