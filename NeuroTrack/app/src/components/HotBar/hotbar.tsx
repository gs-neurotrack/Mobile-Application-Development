import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';

const ADMIN_PASSWORD = 'admin123'; 

const Hotbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [adminModalVisible, setAdminModalVisible] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  type TabItem = {
    label: string;
    route: string;
    key: 'MENU' | 'PROFILE' | 'USERS';
  };

  const tabs: TabItem[] = [
    { key: 'MENU', label: 'Menu', route: '/Menu/menu' },
    { key: 'PROFILE', label: 'Perfil', route: '/Profile/profile' },
    { key: 'USERS', label: 'Usuários', route: '/ListUsers/listUsers' },
  ];

  const isActive = (route: string) => pathname === route;

  const handleNavigate = (tab: TabItem) => {
    // Para Menu e Perfil navega direto
    if (tab.key === 'MENU' || tab.key === 'PROFILE') {
      if (tab.route !== pathname) {
        router.replace(tab.route);
      }
      return;
    }

    // Para USERS, abre modal pedindo senha
    if (tab.key === 'USERS') {
      setAdminPassword('');
      setAdminError('');
      setAdminModalVisible(true);
    }
  };

  const handleConfirmAdmin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setAdminModalVisible(false);
      setAdminPassword('');
      setAdminError('');

      if ('/ListUsers/listUsers' !== pathname) {
        router.replace('/ListUsers/listUsers');
      }
    } else {
      setAdminError('Senha inválida. Tente novamente.');
    }
  };

  return (
    <>
      {/* BOTTOM BAR */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingVertical: 10,
          paddingHorizontal: 8,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          backgroundColor: '#FFFFFF',
        }}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.route}
            onPress={() => handleNavigate(tab)}
            style={{
              alignItems: 'center',
              flex: 1,
              paddingVertical: 6,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: isActive(tab.route) ? '700' : '500',
                color: isActive(tab.route) ? '#80c6ac' : '#6b7280',
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* MODAL DE SENHA ADMIN PARA ABA "USUÁRIOS" */}
      <Modal
        visible={adminModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAdminModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
          }}
        >
          <View
            style={{
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                marginBottom: 12,
                color: '#111827',
              }}
            >
              Área restrita
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: '#4B5563',
                marginBottom: 12,
              }}
            >
              Para acessar a lista de usuários, informe a senha de administrador.
            </Text>

            <TextInput
              placeholder="Digite a senha admin"
              value={adminPassword}
              onChangeText={(t) => {
                setAdminPassword(t);
                if (adminError) setAdminError('');
              }}
              secureTextEntry
              style={{
                height:50,
                borderWidth: 1,
                borderColor: '#D1D5DB',
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 10,
                marginBottom: 8,
                color: '#111827',
              }}
              placeholderTextColor="#9CA3AF"
            />

            {adminError ? (
              <Text style={{ color: '#DC2626', marginBottom: 8, fontSize: 13 }}>
                {adminError}
              </Text>
            ) : null}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 8,
              }}
            >
              <Pressable
                onPress={() => {
                  setAdminModalVisible(false);
                  setAdminPassword('');
                  setAdminError('');
                }}
                style={{ paddingVertical: 8, paddingHorizontal: 12, marginRight: 8 }}
              >
                <Text style={{ color: '#6B7280', fontSize: 14 }}>Cancelar</Text>
              </Pressable>

              <Pressable
                onPress={handleConfirmAdmin}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  backgroundColor: '#80c6ac',
                }}
              >
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontWeight: '600',
                    fontSize: 14,
                  }}
                >
                  Confirmar
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Hotbar;
