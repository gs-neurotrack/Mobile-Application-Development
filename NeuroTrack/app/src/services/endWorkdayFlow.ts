import { Alert } from 'react-native';
import { sendUsageToPython } from './pythonApi';
import { sendDailyLogToCSharp } from './gsDailyLogsService';
import { logout } from './authService';
import { usageTracker } from './usageTracker';
import { ROUTES } from '../navigation/routes';
import { router } from 'expo-router'; 

export async function endWorkdayFlow() {
  try {
    
    try {
      await sendUsageToPython();
    } catch (err: any) {
      console.log('Erro ao enviar para Python:', err);
    
    }

  
    try {
      await sendDailyLogToCSharp();
    } catch (err: any) {
      console.log('Erro ao enviar GsDailyLogs para C#:', err);
  
    }

  
    try {
      await logout();
    } catch (err: any) {
      console.log('Erro no logout Java:', err);
    }

 
    usageTracker.reset();

   
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
