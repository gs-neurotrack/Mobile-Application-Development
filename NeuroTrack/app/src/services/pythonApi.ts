  // src/services/pythonApi.ts
  import { usageTracker } from './usageTracker';
  import { UsagePayload } from './usageTracker';


  const PYTHON_API= 'http://163.176.216.51:8000'; // ajuste se for outra porta

  export async function sendUsageToPython() {
    const payload = usageTracker.buildPayload();

    if (!payload) {
      console.log('[PythonAPI] Nenhuma sessão ativa para enviar.');
      return;
    }

    console.log('[PythonAPI] Enviando payload:', payload);

    const response = await fetch(`${PYTHON_API}/logs`, {
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

  export async function sendToPython(payload: UsagePayload) {
    console.log("[PythonAPI] Enviando payload:", payload);

    try {
      const response = await fetch(`${PYTHON_API}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      console.log("[PythonAPI] Resposta:", response.status, text);

      if (!response.ok) {
        throw new Error(`Erro ao enviar para Python: ${response.status} - ${text}`);
      }

      return JSON.parse(text);
    } catch (err) {
      console.log("[PythonAPI] Erro:", err);
      throw err;
    }
  }