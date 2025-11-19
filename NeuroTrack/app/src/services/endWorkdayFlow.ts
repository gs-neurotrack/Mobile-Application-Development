// src/services/endWorkdayFlow.ts
import { Alert } from 'react-native';
import { sendUsageToPython } from './pythonApi';
import { sendDailyLogToCSharp } from './gsDailyLogsService';
import { logout } from './authService';
import { usageTracker } from './usageTracker';
import { ROUTES } from '../navigation/routes';
import { router } from 'expo-router'; // se não der, passo via parâmetro (vejo abaixo)

export async function endWorkdayFlow() {
  try {
    // 1) Envia dados de uso para Python (score, análise etc.)
    try {
      await sendUsageToPython();
    } catch (err: any) {
      console.log('Erro ao enviar para Python:', err);
      // não dou throw aqui para não travar o resto do fluxo
    }

    // 2) Envia log diário para API C# (GsDailyLogs)
    try {
      await sendDailyLogToCSharp();
    } catch (err: any) {
      console.log('Erro ao enviar GsDailyLogs para C#:', err);
      // idem: registra, mas não trava o logout
    }

    // 3) Logout do Java (remove token, email, id, etc.)
    try {
      await logout();
    } catch (err: any) {
      console.log('Erro no logout Java:', err);
    }

    // 4) Reset do tracker local
    usageTracker.reset();

    // 5) Navegar para tela de Login
    router.replace(ROUTES.LOGIN);

    Alert.alert(
      'Expediente encerrado',
      'Seus dados de uso foram enviados para análise.'
    );
  } catch (err: any) {
    console.log('Erro inesperado no endWorkdayFlow:', err);
    Alert.alert(
      'Erro',
      err.message || 'Erro ao encerrar expediente. Tente novamente.'
    );
  }
}
