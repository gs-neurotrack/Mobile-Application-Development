// src/services/sessionEndFlow.ts
import { usageTracker } from './usageTracker';
import { sendToPython } from './pythonApi';
import { sendDailyLogToCSharp } from './gsDailyLogsService';
import { logout } from './authService';

export async function endSessionAndSendData() {
  try {
    console.log('[EndSession] Montando payload para Python...');
    const payload = usageTracker.buildPayload();

    if (!payload) {
      console.log('[EndSession] Nenhuma sessão ativa para enviar.');
      return;
    }


    await sendToPython(payload);

   
    await sendDailyLogToCSharp();

    
    usageTracker.reset();
    await logout();

    console.log('[EndSession] Sessão encerrada com sucesso.');
  } catch (err) {
    console.log('[EndSession ERROR]', err);
    throw err;
  }
}
