import { usageTracker } from "./usageTracker";
import { sendToPython } from "./pythonApi";

export async function sendUsageToPythonNow() {
  const payload = usageTracker.buildPayload();

  if (!payload) {
    console.log("[UsageFlow] Nenhuma sessão ativa para enviar.");
    return null;
  }

  try {
    const result = await sendToPython(payload);
    console.log("[UsageFlow] Resultado da API Python:", result);
    return result;
  } catch (err) {
    console.log("[UsageFlow] Erro:", err);
    throw err;
  }
}
