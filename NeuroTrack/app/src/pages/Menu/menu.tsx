import React, { useState,useEffect} from 'react';
import { View, Text, Modal, TouchableOpacity, Image, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import styles from './style';
import MenuButton from '../../components/MenuButton/menubutton';
import { ROUTES } from '../../navigation/routes';
import InputField from '../../components/InputField/InputField';
import { endWorkdayFlow } from '../../services/endWorkdayFlow';
import { usageTracker } from '../../services/usageTracker';
import GlobalTouchTracker from '../../components/GlobalTouchTracker/globalTouchTracker';
import { sendUsageToPythonNow } from "../../services/sendUsageFlow";
import { endSessionAndSendData } from "../../services/sessionEndFlow";





const ADMIN_PASSWORD = 'admin123'; 

const MenuScreen = () => {
  const router = useRouter();

  const [adminModalVisible, setAdminModalVisible] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  
  const [meetingsCount, setMeetingsCount] = useState(0);

    useEffect(() => {
    const current = usageTracker.getMeetings();
    setMeetingsCount(current);
  }, []);

  const handleChangeMeetings = (text: string) => {
    const num = parseInt(text, 10);
    if (isNaN(num)) {
      setMeetingsCount(0);
      usageTracker.setMeetings(0);
    } else {
      setMeetingsCount(num);
      usageTracker.setMeetings(num);
    }
  };
  const handleMinus = () => {
    const newVal = Math.max(0, meetingsCount - 1);
    setMeetingsCount(newVal);
    usageTracker.setMeetings(newVal);
  };

  const handlePlus = () => {
    const newVal = meetingsCount + 1;
    setMeetingsCount(newVal);
    usageTracker.setMeetings(newVal);
  };

const handleTestSend = async () => {
  try {
    const result = await sendUsageToPythonNow();
    console.log("RESULTADO PYTHON:", result);
  } catch (e) {
    console.log("Erro ao enviar:", e);
  }
};
  const handleOpenAdminModal = () => {
    setAdminPassword('');
    setAdminError('');
    setAdminModalVisible(true);
  };

  const handleConfirmAdminAccess = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setAdminModalVisible(false);
      setAdminError('');
      
      router.push(ROUTES.LIST_USER); 
    } else {
      setAdminError('Senha inválida. Tente novamente.');
    }
  };

  const handleLogout = async () => {
  try {
    await endSessionAndSendData();
    router.replace(ROUTES.LOGIN);
  } catch (err) {
    Alert.alert("Erro", "Falha ao encerrar sessão.");
  }
};

  const handleCloseModal = () => {
    setAdminModalVisible(false);
    setAdminPassword('');
    setAdminError('');
  };
  const [ending, setEnding] = useState(false);

const handleEndWorkday = async () => {
  if (ending) return;

  setEnding(true);
  try {
    await endWorkdayFlow(); 
  } catch (e) {
    console.log(e);
  } finally {
    setEnding(false);   
  }
};

  return (
  <GlobalTouchTracker>
    <View style={styles.container}>
      
  
      <View style={styles.header}>
            <Image
            source={require('../../img/logo_neuro_track_branca.png')}
            style={styles.logo}
            resizeMode="contain"
        />
      </View>

      
      <View style={styles.grid}>
        <MenuButton
          icon="person-circle-outline"
          label="Perfil"
          onPress={() => router.push(ROUTES.PROFILE)}
        />

        <MenuButton
          icon="eye-outline"
          label="Ver Dados"
          onPress={() => router.push(ROUTES.SCORES)}
        />

        <MenuButton
          icon="search-outline"
          label="Buscar Usuários"
          onPress={handleOpenAdminModal}
        />

        <MenuButton
          icon="add-circle-outline"
          label="Adicionar"
          onPress={() => router.push(ROUTES.ABOUT)}
        />
         <TouchableOpacity
        style={styles.buttonExit}
      
        onPress={handleLogout}
        disabled={ending}
      >
        {ending ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonTextExit}>Encerrar expediente</Text>
        )}
      </TouchableOpacity>
    
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Reuniões realizadas hoje</Text>

        <View style={styles.meetingsRow}>
          <TouchableOpacity style={styles.meetingsButton} onPress={handleMinus}>
            <Text style={styles.meetingsButtonText}>-</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.meetingsInput}
            keyboardType="numeric"
            value={String(meetingsCount)}
            onChangeText={handleChangeMeetings}
          />

          <TouchableOpacity style={styles.meetingsButton} onPress={handlePlus}>
            <Text style={styles.meetingsButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.meetingsHint}>
          Informe quantas reuniões você participou neste expediente.
        </Text>
      </View>

    
      </View>


  
      <Modal
        visible={adminModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Acesso Administrativo</Text>
            <Text style={styles.modalSubtitle}>
              Informe a senha de administrador para continuar.
            </Text>

            <InputField
              placeholder="Senha de admin"
              value={adminPassword}
              onChangeText={(t) => {
                setAdminPassword(t);
                if (adminError) setAdminError('');
              }}
              secureTextEntry
              keyboardType="default"
            />

            {adminError ? (
              <Text style={styles.modalError}>{adminError}</Text>
            ) : null}

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={handleCloseModal}
              >
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleConfirmAdminAccess}
              >
                <Text style={styles.modalButtonTextConfirm}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
    </View>
    </GlobalTouchTracker>
  );
};

export default MenuScreen;
