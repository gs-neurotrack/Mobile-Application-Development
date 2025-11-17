import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import styles from './style';
import InputField from '../../components/InputField/InputField';
import { ROUTES } from '../../navigation/routes'; 
import { loginApi } from '../../services/authService';



const Login = () => {


  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage]   = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  
  const handleLogin = async () => {
    
    setMessage('');

    if(!email || !password){

      setMessage('Preencha todos os campos.');
      return;

    }
    try{
      setIsLoggedIn(true);

      
       await loginApi(email, password);
       setMessage('Login bem-sucedido!');

       router.replace(ROUTES.REGISTER);
    }
    catch(error: any){
      setMessage(error.message);
    }finally{
      setIsLoggedIn(false);
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

      <InputField
        placeholder="Digite seu email"
        value={email}
        onChangeText={(t) => { setEmail(t); if (message) setMessage(''); }}
        keyboardType="email-address"
        
      />

      <InputField
        placeholder="Digite sua senha"
        value={password}
        onChangeText={(t) => { setPassword(t); if (message) setMessage(''); }}
        secureTextEntry
        keyboardType="password"
      />

      {message ? <Text style={styles.text_message}>{message}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoggedIn}>
        {isLoggedIn ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>

     
        <Text style={{ marginTop: 20, color: '#000000' }}>
          Não possui uma conta? 
          <TouchableOpacity onPress={() => router.push(ROUTES.REGISTER)}>
            <Text style={{ marginTop: 20, color: '#80c6ac' }}> Cadastre-se</Text>
          </TouchableOpacity>
        </Text>
      
    </View>
  );
};



export default Login;