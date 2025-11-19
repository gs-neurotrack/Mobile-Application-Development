// src/screens/Register/Register.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import styles from './style';
import InputField from '../../components/InputField/InputField';
import { ROUTES } from '../../navigation/routes';
import { registerApi } from '../../services/authService';
import { fetchLimits, GsLimit } from '../../services/limitsService'; 
import TrackedButton from '../../components/TrackedButton/trackedButton';

const cargoOptions = [
  { id: 1, label: 'Coordenador', value: 'Coordenador' },
  { id: 2, label: 'Colaborador', value: 'Colaborador' },
];

type LimitOption = {
  id: number;
  label: string;
};

const Register = () => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // CARGO
  const [selectedCargoId, setSelectedCargoId] = useState<number | null>(null);
  const [cargoModalVisible, setCargoModalVisible] = useState(false);

  // LIMITES vindos da API C#
  const [limitOptions, setLimitOptions] = useState<LimitOption[]>([]);
  const [selectedLimitId, setSelectedLimitId] = useState<number | null>(null);
  const [limitModalVisible, setLimitModalVisible] = useState(false);
  const [loadingLimits, setLoadingLimits] = useState(false);

  const [saving, setSaving] = useState(false);

  const selectedCargoLabel =
    selectedCargoId != null
      ? cargoOptions.find((opt) => opt.id === selectedCargoId)?.label ?? 'Selecione seu cargo'
      : 'Selecione seu cargo';

  const selectedLimitLabel =
    selectedLimitId != null
      ? limitOptions.find((opt) => opt.id === selectedLimitId)?.label ?? 'Selecione seu limite'
      : 'Selecione seu limite';

  // ====== CARREGA LIMITES DA API C# ======
  useEffect(() => {
    const loadLimits = async () => {
      try {
        setLoadingLimits(true);

        const data: GsLimit[] = await fetchLimits();

        const mapped: LimitOption[] = data.map((item) => ({
          id: item.id,
          label: `${item.limitHours} hora${item.limitHours > 1 ? 's' : ''} | ${
            item.limitMeetings
          } reuni${item.limitMeetings > 1 ? 'ões' : 'ão'}`,
        }));

        setLimitOptions(mapped);
      } catch (err: any) {
        console.log(err);
        setMessage(err.message || 'Erro ao carregar limites.');
      } finally {
        setLoadingLimits(false);
      }
    };

    loadLimits();
  }, []);

  // ====== CADASTRAR ======
  const handleRegister = async () => {
    setMessage('');

    if (!name || !email || !password || !selectedCargoId || !selectedLimitId) {
      setMessage('Preencha todos os campos e selecione cargo e limite.');
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name,
        email,
        password,
        status: 'A', // fixo
        roleId: selectedCargoId,
        limitsId: selectedLimitId, // id vindo da API C#
      };

      console.log('[REGISTER PAYLOAD]', payload);

      await registerApi(payload);

      setMessage('Usuário cadastrado com sucesso!');
      router.replace(ROUTES.LOGIN);
    } catch (err: any) {
      console.log(err);
      setMessage(err.message || 'Erro ao cadastrar usuário.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../img/logo_neuro_track.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Bem-vindo</Text>

      <ScrollView style={{ width: '100%' }}>
        <Text style={styles.titleDate}>Dados Pessoais</Text>

        <InputField
          placeholder="Digite seu nome completo"
          value={name}
          onChangeText={(t) => {
            setName(t);
            if (message) setMessage('');
          }}
          keyboardType="default"
        />

        <InputField
          placeholder="Digite seu email"
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            if (message) setMessage('');
          }}
          keyboardType="email-address"
        />

        <InputField
          placeholder="Digite sua senha"
          value={password}
          onChangeText={(t) => {
            setPassword(t);
            if (message) setMessage('');
          }}
          secureTextEntry
          keyboardType="default"
        />

        {/* CARGO */}
        <Text style={styles.titleDate}>Cargo</Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setCargoModalVisible(true)}
        >
          <Text style={{ color: selectedCargoId ? '#000' : '#999' }}>
            {selectedCargoLabel}
          </Text>
        </TouchableOpacity>

        {/* LIMITE */}
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
            <Text style={{ color: selectedLimitId ? '#000' : '#999' }}>
              {selectedLimitLabel}
            </Text>
          )}
        </TouchableOpacity>

        {message ? <Text style={styles.text_message}>{message}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={saving}
        >
          <Text style={styles.buttonText}>
            {saving ? 'Cadastrando...' : 'Cadastrar'}
          </Text>
        </TouchableOpacity>

        <Text style={{ marginTop: 20, color: '#000000', textAlign: 'center' }}>
          Já possui uma conta?{' '}
          <TouchableOpacity onPress={() => router.push(ROUTES.LOGIN)}>
            <Text style={{ marginTop: 20, color: '#80c6ac' }}>Entrar</Text>
          </TouchableOpacity>
        </Text>
      </ScrollView>

      {/* MODAL CARGO */}
      <Modal
        visible={cargoModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCargoModalVisible(false)}
      >
        <View style={styles.bgModal}>
          <View style={styles.optionsSelect}>
            <Text style={styles.titleOptions}>{selectedCargoLabel}</Text>

            <FlatList
              data={cargoOptions}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedCargoId(item.id);
                    setCargoModalVisible(false);
                  }}
                  style={styles.flatListItem}
                >
                  <Text style={{ fontSize: 16 }}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              onPress={() => setCargoModalVisible(false)}
              style={styles.buttonCancel}
            >
              <Text style={styles.textCancel}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL LIMITES */}
      <Modal
        visible={limitModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLimitModalVisible(false)}
      >
        <View style={styles.bgModal}>
          <View style={styles.optionsSelect}>
            <Text style={styles.titleOptions}>{selectedLimitLabel}</Text>

            <FlatList
              data={limitOptions}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedLimitId(item.id);
                    setLimitModalVisible(false);
                  }}
                  style={styles.flatListItem}
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
    </View>
  );
};

export default Register;
