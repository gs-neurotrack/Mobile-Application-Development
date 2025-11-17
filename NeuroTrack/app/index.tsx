import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, View } from 'react-native';
import { ROUTES } from './src/navigation/routes';
import styles from './style';

export default function SplashScreen() {



  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(async () => {
        router.replace(ROUTES.LOGIN); 

     

    }, 3000); 

    return () => clearTimeout(timer);


  }, [router]);




  return (
    <View style={styles.container}>

      <Image
        source={require('./src/img/logo_neuro_track.png')}
        style={styles.logo}
        resizeMode="contain"
      />


    </View>
  );
}