import React, { useState, useEffect } from 'react';
import {View,Text,TouchableOpacity,  Image,  ScrollView,Modal,FlatList, ActivityIndicator} from 'react-native';
import { useRouter } from 'expo-router';
import styles from './style';
import InputField from '../../components/InputField/InputField';
import { ROUTES } from '../../navigation/routes';
import { registerApi } from '../../services/authService';
import { fetchLimits, GsLimit } from '../../services/limitsService';

const cargoOptions = [
  { id: 7, label: 'Coordenador', value: 'Coordenador' },
  { id: 41, label: 'Colaborador', value: 'Colaborador' },
];

type LimitOption = {
  id: number;
  label: string;
};


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register = () => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [cargoError, setCargoError] = useState('');
  const [limitError, setLimitError] = useState('');

  const [selectedCargoId, setSelectedCargoId] = useState<number | null>(null);
  const [cargoModalVisible, setCargoModalVisible] = useState(false);

  const [limitOptions, setLimitOptions] = useState<LimitOption[]>([]);
  const [selectedLimitId, setSelectedLimitId] = useState<number | null>(null);
  const [limitModalVisible, setLimitModalVisible] = useState(false);
  const [loadingLimits, setLoadingLimits] = useState(false);

  const [saving, setSaving] = useState(false);

  const selectedCargoLabel =
    selectedCargoId != null
      ? cargoOptions.find((opt) => opt.id === selectedCargoId)?.label ??
        'Selecione seu cargo'
      : 'Selecione seu cargo';

  const selectedLimitLabel =
    selectedLimitId != null
      ? limitOptions.find((opt) => opt.id === selectedLimitId)?.label ??
        'Selecione seu limite'
      : 'Selecione seu limite';

  useEffect(() => {
    const loadLimits = async () => {
      try {
        setLoadingLimits(true);

        const data: GsLimit[] = await fetchLimits();

        const mapped: LimitOption[] = data.map((item) => ({
          id: item.id,
          label: `${item.limitHours} hora${
            item.limitHours > 1 ? 's' : ''
          } | ${item.limitMeetings} reuni${
            item.limitMeetings > 1 ? 'ões' : 'ão'
          }`,
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

  const handleRegister = async () => {
    
    setMessage('');
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setCargoError('');
    setLimitError('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    let hasError = false;

    
    if (!trimmedName) {
      setNameError('Informe seu nome completo.');
      hasError = true;
    } else if (trimmedName.length < 12) {
      setNameError('Nome muito curto. Use pelo menos 12 caracteres.');
      hasError = true;
    }

    
    if (!trimmedEmail) {
      setEmailError('Informe um e-mail.');
      hasError = true;
    } else if (!emailRegex.test(trimmedEmail)) {
      setEmailError('E-mail inválido. Verifique o formato (ex: nome@empresa.com).');
      hasError = true;
    }


    if (!password) {
      setPasswordError('Informe uma senha.');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Senha muito curta. Use pelo menos 6 caracteres.');
      hasError = true;
    }

    
    if (!selectedCargoId) {
      setCargoError('Selecione um cargo para continuar.');
      hasError = true;
    }

    
    if (!selectedLimitId) {
      setLimitError('Selecione um limite de horas e reuniões.');
      hasError = true;
    }

    if (hasError) {
      
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: trimmedName,
        email: trimmedEmail,
        password,
        status: 'A',
        roleId: selectedCargoId!,
        limitsId: selectedLimitId!,
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
            if (nameError) setNameError('');
            if (message) setMessage('');
          }}
          keyboardType="default"
        />
        {nameError ? (
          <Text style={styles.text_message}>{nameError}</Text>
        ) : null}

       
        <InputField
          placeholder="Digite seu email"
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            if (emailError) setEmailError('');
            if (message) setMessage('');
          }}
          keyboardType="email-address"
        />
        {emailError ? (
          <Text style={styles.text_message}>{emailError}</Text>
        ) : null}

       
        <InputField
          placeholder="Digite sua senha"
          value={password}
          onChangeText={(t) => {
            setPassword(t);
            if (passwordError) setPasswordError('');
            if (message) setMessage('');
          }}
          secureTextEntry
          keyboardType="default"
        />
        {passwordError ? (
          <Text style={styles.text_message}>{passwordError}</Text>
        ) : null}

       
        <Text style={styles.titleDate}>Cargo</Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setCargoModalVisible(true)}
        >
          <Text style={{ color: selectedCargoId ? '#000' : '#999' }}>
            {selectedCargoLabel}
          </Text>
        </TouchableOpacity>
        {cargoError ? (
          <Text style={styles.text_message}>{cargoError}</Text>
        ) : null}

        
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
        {limitError ? (
          <Text style={styles.text_message}>{limitError}</Text>
        ) : null}

       
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
                    setCargoError('');
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
                    setLimitError('');
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
