// src/screens/Profile/ProfileScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import styles from './style';
import InputField from '../../components/InputField/InputField';
import { ROUTES } from '../../navigation/routes';

import {
  getUserById,
  updateUserById,
  deleteUserById,
  getLoggedUserId,
  logout,
  User,
} from '../../services/authService';

import { fetchLimits, GsLimit } from '../../services/limitsService';

import Hotbar from '../../components/HotBar/hotbar';

// 🔹 Opções mockadas de cargo (apenas para exibir label)
const cargoOptions = [
  { id: 1, label: 'Coordenador', value: 'Coordenador' },
  { id: 2, label: 'Colaborador', value: 'Colaborador' },
];

type LimitOption = {
  id: number;
  label: string;
};

const ProfileScreen = () => {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('A');

  const [roleId, setRoleId] = useState<number | null>(null);
  const [limitsId, setLimitsId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // LIMITES vindos da API C#
  const [limitOptions, setLimitOptions] = useState<LimitOption[]>([]);
  const [loadingLimits, setLoadingLimits] = useState(false);
  const [limitModalVisible, setLimitModalVisible] = useState(false);

  // label amigável pro cargo (somente leitura)
  const cargoLabel =
    roleId != null
      ? cargoOptions.find((c) => c.id === roleId)?.label ?? 'Cargo não informado'
      : 'Cargo não informado';

  // label amigável pro limite (editável)
  const limitLabel =
    limitsId != null
      ? limitOptions.find((l) => l.id === limitsId)?.label ?? 'Limite não informado'
      : 'Selecione seu limite';

  // --------- CARREGAR PERFIL A PARTIR DO ID SALVO ---------
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setMessage('');

        const storedId = await getLoggedUserId();

        if (!storedId) {
          setMessage('Usuário não autenticado.');
          await logout();
          router.replace(ROUTES.LOGIN);
          return;
        }

        const data = await getUserById(storedId);

        setUser(data);
        setName(data.name);
        setEmail(data.email);
        setPassword('');
        setStatus(data.status || 'A');

        const roleFromApi = data.roleId ?? data.role?.id ?? null;
        const limitsFromApi = data.limitsId ?? data.limits?.id ?? null;

        setRoleId(roleFromApi);
        setLimitsId(limitsFromApi);
      } catch (err: any) {
        console.log(err);
        setMessage(err.message || 'Erro ao carregar os dados.');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  // --------- CARREGAR LIMITES DA API C# ---------
  useEffect(() => {
    const loadLimits = async () => {
      try {
        setLoadingLimits(true);

        const data: GsLimit[] = await fetchLimits();

        const mapped: LimitOption[] = data.map((item) => ({
          id: item.id,
          label: `${item.limitHours} hora${item.limitHours > 1 ? 's' : ''} | ${
            item.limitMeetings
          } reunião${item.limitMeetings > 1 ? 'es' : ''}`,
        }));

        setLimitOptions(mapped);
      } catch (err: any) {
        console.log(err);
        // não quebra a tela, só mostra mensagem
        setMessage((prev) => prev || err.message || 'Erro ao carregar limites.');
      } finally {
        setLoadingLimits(false);
      }
    };

    loadLimits();
  }, []);

  // --------- SALVAR (PUT) ---------
  const handleSave = async () => {
  if (!user) return;

  const updated: User = {
    ...user,
    name,
    email,
    status: 'A',
    roleId: roleId ?? user.role?.id,
    limitsId: limitsId ?? user.limits?.id,
  };

  // Só envia password se o usuário digitou alguma coisa
  if (password && password.trim().length > 0) {
    updated.password = password;
  }

  const saved = await updateUserById(updated);
  setUser(saved);
  setMessage('Dados atualizados com sucesso!');
};

  // --------- DELETAR (DELETE) ---------
  const handleDelete = () => {
    Alert.alert(
      'Excluir conta',
      'Tem certeza que deseja excluir sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              setSaving(true);

              // o service pode usar o id logado internamente
              await deleteUserById();

              await logout();
              Alert.alert('Conta removida', 'Sua conta foi excluída.');
              router.replace(ROUTES.LOGIN);
            } catch (err: any) {
              console.log(' Erro ao excluir usuário:', err);
              Alert.alert('Erro', err.message || 'Erro ao excluir conta.');
            } finally {
              setSaving(false);
            }
          },
        },
      ]
    );
  };

  // --------- ESTADOS DE CARREGAMENTO ---------
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator />
        <Text style={{ marginTop: 10 }}>Carregando dados...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#000' }}>{message || 'Usuário não encontrado.'}</Text>
      </View>
    );
  }

  // --------- TELA DE PERFIL ---------
  return (
    <View style={styles.container}>
      <Image
        source={require('../../img/logo_neuro_track.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Meu Perfil</Text>

      <ScrollView style={{ width: '100%' }}>
        <Text style={styles.titleDate}>Dados Pessoais</Text>

        <InputField
          placeholder="Nome completo"
          value={name}
          keyboardType="default"
          onChangeText={(t) => {
            setName(t);
            if (message) setMessage('');
          }}
        />

        <InputField
          placeholder="Email"
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            if (message) setMessage('');
          }}
          keyboardType="email-address"
        />

        <InputField
          placeholder="Senha"
          value={password}
          onChangeText={(t) => {
            setPassword(t);
            if (message) setMessage('');
          }}
          secureTextEntry
          keyboardType="default"
        />

        {/* CARGO - SOMENTE LEITURA */}
        <Text style={styles.titleDate}>Cargo</Text>
        <View style={[styles.selectButton, { backgroundColor: '#f3f4f6' }]}>
          <Text style={{ color: '#555' }}>{cargoLabel}</Text>
        </View>

        {/* LIMITE - EDITÁVEL COM MODAL */}
        <Text style={styles.titleDate}>Limite</Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => {
            if (!loadingLimits && limitOptions.length > 0) {
              setLimitModalVisible(true);
            }
          }}
        >
          {loadingLimits ? (
            <ActivityIndicator />
          ) : (
            <Text style={{ color: limitsId ? '#000' : '#999' }}>{limitLabel}</Text>
          )}
        </TouchableOpacity>

        {message ? <Text style={styles.text_message}>{message}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.buttonText}>
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#E53935', marginTop: 10 }]}
          onPress={handleDelete}
          disabled={saving}
        >
          <Text style={styles.buttonText}>Excluir conta</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL DE LIMITES */}
      <Modal
        visible={limitModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLimitModalVisible(false)}
      >
        <View style={styles.bgModal}>
          <View style={styles.optionsSelect}>
            <Text style={styles.titleOptions}>{limitLabel}</Text>

            <FlatList
              data={limitOptions}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.flatListItem}
                  onPress={() => {
                    setLimitsId(item.id);
                    setLimitModalVisible(false);
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              onPress={() => setLimitModalVisible(false)}
              style={styles.buttonCancel}
            >
              <Text style={styles.textCancel}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
            <Hotbar />

    </View>
  );
};

export default ProfileScreen;
