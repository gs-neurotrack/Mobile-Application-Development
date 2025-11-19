// src/screens/Menu/MenuScreen.tsx
import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import styles from './style';
import MenuButton from '../../components/MenuButton/menubutton';
import { ROUTES } from '../../navigation/routes';
import InputField from '../../components/InputField/InputField';
import { endWorkdayFlow } from '../../services/endWorkdayFlow';


const ADMIN_PASSWORD = 'admin123'; // senha mockada

const MenuScreen = () => {
  const router = useRouter();

  const [adminModalVisible, setAdminModalVisible] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  const handleOpenAdminModal = () => {
    setAdminPassword('');
    setAdminError('');
    setAdminModalVisible(true);
  };

  const handleConfirmAdminAccess = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setAdminModalVisible(false);
      setAdminError('');
      // ajuste aqui para a rota correta da sua tela de admin
      router.push(ROUTES.LIST_USER); 
    } else {
      setAdminError('Senha inválida. Tente novamente.');
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

    Alert.alert(
      'Encerrar expediente',
      'Você deseja encerrar seu expediente e enviar os dados de uso?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          style: 'destructive',
          onPress: async () => {
            try {
              setEnding(true);
              await endWorkdayFlow();
            } finally {
              setEnding(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
            <Image
            source={require('../../img/logo_neuro_track_branca.png')}
            style={styles.logo}
            resizeMode="contain"
        />
      </View>

      {/* GRID DE BOTÕES */}
      <View style={styles.grid}>
        <MenuButton
          icon="person-circle-outline"
          label="Perfil"
          onPress={() => router.push(ROUTES.PROFILE)}
        />

        <MenuButton
          icon="eye-outline"
          label="Ver Dados"
          onPress={() => alert('Ver dados')}
        />

        <MenuButton
          icon="search-outline"
          label="Buscar Admin"
          onPress={handleOpenAdminModal}
        />

        <MenuButton
          icon="add-circle-outline"
          label="Adicionar"
          onPress={() => alert('Adicionar')}
        />
         <TouchableOpacity
        style={styles.buttonExit}
        onPress={handleEndWorkday}
        disabled={ending}
      >
        {ending ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonTextExit}>Encerrar expediente</Text>
        )}
      </TouchableOpacity>
      </View>

      {/* MODAL DE SENHA ADMIN */}
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
  );
};

export default MenuScreen;
