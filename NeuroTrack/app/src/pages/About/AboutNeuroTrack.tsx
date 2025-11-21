import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import styles from './style';
import Hotbar from '../../components/HotBar/hotbar';
import GlobalTouchTracker from '../../components/GlobalTouchTracker/globalTouchTracker';

const AboutNeuroTrackScreen = () => {
  const router = useRouter();

  return (
    <GlobalTouchTracker>
      <View style={styles.container}>
        
        <View style={styles.header}>
          <Image
            source={require('../../img/logo_neuro_track_branca.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Sobre o NeuroTrack</Text>
            <Text style={styles.subtitle}>
              Entenda o que o sistema faz e como pode ajudar sua equipe.
            </Text>
          </View>
        </View>

        <ScrollView
          style={{ width: '100%' }}
          contentContainerStyle={styles.scrollContent}
        >
         
          <View style={styles.card}>
            <Text style={styles.cardTitle}>O que é o NeuroTrack?</Text>
            <Text style={styles.cardText}>
              O <Text style={styles.highlight}>NeuroTrack</Text> é um sistema de
              monitoramento e previsão de estresse digital no ambiente de trabalho.
              Ele acompanha o comportamento de uso do computador e do celular para
              calcular um <Text style={styles.highlight}>Score de Estresse</Text> e
              gerar <Text style={styles.highlight}>previsões futuras</Text> sobre a
              carga mental dos colaboradores.
            </Text>
          </View>

       
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Como funciona na prática?</Text>
            <Text style={styles.cardText}>
              Durante o expediente, o sistema coleta informações como:
            </Text>
            <Text style={styles.bullet}>• Horas de trabalho registradas</Text>
            <Text style={styles.bullet}>• Quantidade de reuniões</Text>
            <Text style={styles.bullet}>• Cliques e interações com a tela</Text>
            <Text style={styles.bullet}>• Encerramento do expediente</Text>

            <Text style={[styles.cardText, { marginTop: 8 }]}>
              Com esses dados, uma API de IA calcula o{' '}
              <Text style={styles.highlight}>Score de Estresse</Text> diário (0 a 100)
              e gera <Text style={styles.highlight}>previsões</Text> para as próximas
              horas ou dias. Essas informações aparecem em gráficos e cards dentro do
              app.
            </Text>
          </View>

      
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Para quem é o sistema?</Text>
            <Text style={styles.cardText}>
              • <Text style={styles.highlight}>Colaboradores</Text>: acompanham o
              próprio nível de estresse ao longo do tempo e recebem orientações sobre
              bem-estar digital.
            </Text>
            <Text style={styles.cardText}>
              • <Text style={styles.highlight}>Gestores / Coordenadores</Text>:
              visualizam gráficos e previsões da equipe para agir de forma preventiva,
              evitando sobrecarga e risco de burnout.
            </Text>
          </View>

         
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Principais recursos</Text>
            <Text style={styles.bullet}>
              • Histórico de Score de Estresse, com gráfico e linha de média.
            </Text>
            <Text style={styles.bullet}>
              • Interpretação das faixas (baixo, moderado, alto, crítico).
            </Text>
            <Text style={styles.bullet}>
              • Visão preditiva para gestores (tela ScoresAdmin).
            </Text>
            <Text style={styles.bullet}>
              • Cadastro de limite de horas e reuniões por colaborador.
            </Text>
            <Text style={styles.bullet}>
              • Monitoramento de uso (cliques, reuniões, tempo de trabalho).
            </Text>
          </View>

        
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Qual é o objetivo?</Text>
            <Text style={styles.cardText}>
              O objetivo do NeuroTrack é <Text style={styles.highlight}>
                prevenir o esgotamento digital
              </Text>{' '}
              e ajudar empresas a cuidarem melhor da saúde mental de suas equipes,
              usando dados reais do dia a dia e previsões inteligentes para apoiar
              decisões.
            </Text>
          </View>

         
          <View style={styles.cardInfo}>
            <Text style={styles.cardInfoTitle}>Importante</Text>
            <Text style={styles.cardInfoText}>
              Os dados exibidos no app são simulados e fazem parte de um projeto
              acadêmico. Em um ambiente real, o NeuroTrack pode ser integrado a dados
              da empresa, sempre respeitando políticas de privacidade e LGPD.
            </Text>
          </View>
        </ScrollView>

        <Hotbar />
      </View>
    </GlobalTouchTracker>
  );
};

export default AboutNeuroTrackScreen;
