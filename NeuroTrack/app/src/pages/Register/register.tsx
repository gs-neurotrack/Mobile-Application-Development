import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Modal, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import styles from './style';
import InputField from '../../components/InputField/InputField';
import { ROUTES } from '../../navigation/routes';
import { registerApi } from '../../services/authService';


const cargoOptions = [
  { id: 1, label: 'Coordenador', value: 'Coordenador' },
  { id: 2, label: 'Colaborador', value: 'Colaborador' },
];

const limitOptions = [
  { id: 1, label: '1 hora | 1 reunião', value: '1-1' },
  { id: 2, label: '1 hora | 2 reuniões', value: '1-2' },
  { id: 3, label: '1 hora | 3 reuniões', value: '1-3' },
  { id: 4, label: '1 hora | 4 reuniões', value: '1-4' },

  { id: 5, label: '2 horas | 1 reunião', value: '2-1' },
  { id: 6, label: '2 horas | 2 reuniões', value: '2-2' },
  { id: 7, label: '2 horas | 3 reuniões', value: '2-3' },
  { id: 8, label: '2 horas | 4 reuniões', value: '2-4' },

  { id: 9, label: '3 horas | 1 reunião', value: '3-1' },
  { id: 10, label: '3 horas | 2 reuniões', value: '3-2' },
  { id: 11, label: '3 horas | 3 reuniões', value: '3-3' },
  { id: 12, label: '3 horas | 4 reuniões', value: '3-4' },
];

const Register = () => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const [selectedCargo, setSelectedCargo] = useState<string | null>(null);
  const [selectedLimit, setSelectedLimit] = useState<string | null>(null);

  const [cargoModalVisible, setCargoModalVisible] = useState(false);
  const [limitModalVisible, setLimitModalVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  const selectedCargoLabel =
    cargoOptions.find((opt) => opt.value === selectedCargo)?.label || 'Selecione seu cargo';

  const selectedLimitLabel =
    limitOptions.find((opt) => opt.value === selectedLimit)?.label || 'Selecione o limite';

  const handleSelectCargo = (value: string) => {
    setSelectedCargo(value);
    setCargoModalVisible(false);
  };

  const handleSelectLimit = (value: string) => {
    setSelectedLimit(value);
    setLimitModalVisible(false);
  };

  const handleRegister = async () => {
    setMessage('');

    if (!name || !email || !password) {
      setMessage('Preencha nome, email e senha.');
      return;
    }

    if (!selectedCargo) {
      setMessage('Selecione seu cargo.');
      return;
    }

    if (!selectedLimit) {
      setMessage('Selecione o limite.');
      return;
    }

    const cargo = cargoOptions.find((opt) => opt.value === selectedCargo);
    const limite = limitOptions.find((opt) => opt.value === selectedLimit);

    if (!cargo || !limite) {
      setMessage('Erro interno ao processar cargo/limite.');
      return;
    }

    const payload = {
      name,
      email,
      password,
      status: 'A',         
      roleId: cargo.id,  
      limitsId: limite.id, 
    };

    try {
      setLoading(true);
      await registerApi(payload);
      setMessage('Cadastro realizado com sucesso!');

    } catch (err: any) {
      console.log('Erro ao cadastrar:', err);
      setMessage(err.message || 'Erro ao cadastrar usuário.');
    } finally {
      setLoading(false);
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
          keyboardType='password'
        />

        {message ? <Text style={styles.text_message}>{message}</Text> : null}

        {/* CARGO */}
        <Text style={styles.titleDate}>Cargo</Text>

        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setCargoModalVisible(true)}
        >
          <Text style={{ color: selectedCargo ? '#000' : '#999' }}>
            {selectedCargoLabel}
          </Text>
        </TouchableOpacity>

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
                    onPress={() => handleSelectCargo(item.value)}
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

        {/* LIMITE */}
        <Text style={styles.titleDate}>Limite</Text>

        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setLimitModalVisible(true)}
        >
          <Text style={{ color: selectedLimit ? '#000' : '#999' }}>
            {selectedLimitLabel}
          </Text>
        </TouchableOpacity>

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
                    onPress={() => handleSelectLimit(item.value)}
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

        {/* BOTÃO CADASTRAR */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </Text>
        </TouchableOpacity>

        <Text style={{ marginTop: 20, color: '#000000', textAlign: 'center' }}>
          Já possui uma conta?{' '}
          <TouchableOpacity onPress={() => router.push(ROUTES.LOGIN)}>
            <Text style={{ marginTop: 20, color: '#80c6ac' }}>Entrar</Text>
          </TouchableOpacity>
        </Text>
      </ScrollView>
    </View>
  );
};

export default Register;
