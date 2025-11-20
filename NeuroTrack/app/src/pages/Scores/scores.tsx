// src/screens/Scores/ScoresScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';

import styles from './style';
import { ROUTES } from '../../navigation/routes';
import { fetchScoresForLoggedUser, UserScore } from '../../services/scoresService';
import { logout } from '../../services/authService';
import Hotbar from '../../components/HotBar/hotbar';

const screenWidth = Dimensions.get('window').width - 32;

const ScoresScreen = () => {
  const router = useRouter();

  const [scores, setScores] = useState<UserScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setMessage('');

        const data = await fetchScoresForLoggedUser();

        if (!data || data.length === 0) {
          setMessage(
            'Ainda não há scores calculados para o seu usuário.\n' +
              'Use o sistema normalmente e encerre o expediente para gerar novos dados.'
          );
          setScores([]);
          return;
        }

        // ordena por data_score
        const ordered = [...data].sort((a, b) => {
          const da = new Date(a.dateScore ?? a.createdAt).getTime();
          const db = new Date(b.dateScore ?? b.createdAt).getTime();
          return da - db;
        });

        setScores(ordered);
      } catch (err: any) {
        console.log('[ScoresScreen] erro:', err);

        if (err.message?.includes('Usuário não autenticado')) {
          await logout();
          router.replace(ROUTES.LOGIN);
          return;
        }

        setMessage(
          err.message ||
            'Não foi possível carregar seus scores. Tente novamente mais tarde.'
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  // ------- MONTA DADOS DO GRÁFICO -------

  const labels = scores.map((s) => {
    const d = new Date(s.dateScore ?? s.createdAt);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  });

  const values = scores.map((s) => s.scoreValue);

  // média dos scores
  const average =
    values.reduce((sum, v) => sum + v, 0) / (values.length || 1);

  const chartData = {
    labels,
    datasets: [
      {
        // linha principal do score
        data: values,
        color: (opacity = 1) => `rgba(128, 198, 172, ${opacity})`,
        strokeWidth: 2,
      },
      {
        // linha horizontal da média
        data: values.map(() => average),
        color: () => `rgba(239, 68, 68, 1)`, // vermelho
        strokeWidth: 2,
        withDots: false,
      },
    ],
  };

  // ====== INTERPRETAÇÃO DO SCORE ======

  const getRiskInfo = (score: number) => {
    if (score <= 20) {
      return {
        label: 'Baixo estresse',
        color: '#22c55e',
        description: 'Você está em uma faixa considerada saudável de estresse.',
      };
    }
    if (score <= 50) {
      return {
        label: 'Estresse moderado',
        color: '#eab308',
        description: 'Nível de estresse moderado. Fique atento à sua rotina.',
      };
    }
    if (score <= 80) {
      return {
        label: 'Estresse alto',
        color: '#f97316',
        description: 'Estresse elevado. Recomenda-se pausas e reorganização de tarefas.',
      };
    }
    return {
      label: 'Estresse crítico',
      color: '#ef4444',
      description: 'Nível crítico de estresse. Procure apoio e reduza sua carga.',
    };
  };

  // pega o score mais recente para resumo (ignorando zeros, se existirem)
  const validScores = scores.filter(
    (s) => typeof s.scoreValue === 'number' && s.scoreValue > 0
  );
  const lastScore = validScores.length > 0 ? validScores[validScores.length - 1] : null;
  const lastScoreRisk = lastScore ? getRiskInfo(lastScore.scoreValue) : null;

  // ------- ESTADOS ESPECIAIS -------

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator />
        <Text style={{ marginTop: 10 }}>Carregando seus dados de estresse...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require('../../img/logo_neuro_track_branca.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Meu histórico de estresse</Text>
      </View>

      <ScrollView style={{ width: '100%' }} contentContainerStyle={styles.scrollContent}>
        {message ? <Text style={styles.infoText}>{message}</Text> : null}

        {scores.length > 0 && (
          <>
            {/* CARD RESUMO DO ÚLTIMO SCORE */}
            {lastScore && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Último score calculado</Text>

                <Text style={styles.cardScoreValue}>
                  {lastScore.scoreValue.toFixed(2)}
                </Text>

                <Text style={styles.cardDate}>
                  Data:{' '}
                  {new Date(
                    lastScore.dateScore ?? lastScore.createdAt
                  ).toLocaleString('pt-BR')}
                </Text>

                {lastScoreRisk && (
                  <View style={{ marginTop: 8 }}>
                    <Text
                      style={{
                        fontWeight: '600',
                        color: lastScoreRisk.color,
                        marginBottom: 4,
                      }}
                    >
                      Nível atual: {lastScoreRisk.label}
                    </Text>
                    <Text style={styles.cardHint}>{lastScoreRisk.description}</Text>
                  </View>
                )}

                <Text style={[styles.cardHint, { marginTop: 8 }]}>
                  O Score varia de 0 a 100. Quanto maior o valor, maior o nível estimado
                  de estresse no fechamento do expediente.
                </Text>
              </View>
            )}

            {/* LEGENDA / INTERPRETAÇÃO DO SCORE */}
            <View
              style={{
                backgroundColor: '#0f172a',
                padding: 16,
                borderRadius: 12,
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#fff',
                  marginBottom: 6,
                }}
              >
                Como interpretar os valores do gráfico
              </Text>

              <Text style={{ color: '#d1fae5', marginBottom: 8 }}>
                Cada ponto no gráfico representa o seu Score de Estresse diário
                (0 a 100). Valores mais altos indicam maior nível de estresse.
              </Text>

              {/* Faixa de cores horizontal */}
              <View
                style={{
                  flexDirection: 'row',
                  height: 10,
                  borderRadius: 999,
                  overflow: 'hidden',
                  marginBottom: 10,
                }}
              >
                <View style={{ flex: 1, backgroundColor: '#22c55e' }} />
                <View style={{ flex: 1, backgroundColor: '#eab308' }} />
                <View style={{ flex: 1, backgroundColor: '#f97316' }} />
                <View style={{ flex: 1, backgroundColor: '#ef4444' }} />
              </View>

              <View style={{ marginTop: 4 }}>
                <Text style={{ color: '#22c55e' }}>🟢 0 – 20 → Baixo estresse</Text>
                <Text style={{ color: '#eab308' }}>🟡 21 – 50 → Moderado</Text>
                <Text style={{ color: '#f97316' }}>🟠 51 – 80 → Alto</Text>
                <Text style={{ color: '#ef4444' }}>🔴 81 – 100 → Crítico</Text>
              </View>
            </View>

            {/* GRÁFICO DE LINHA */}
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Evolução do score ao longo do tempo</Text>

              <Text
                style={{
                  color: '#6b7280',
                  fontSize: 12,
                  marginBottom: 4,
                }}
              >
                Os valores no eixo Y representam o Score de Estresse (0 a 100). O eixo X
                mostra a data dos registros.
              </Text>

              <Text
                style={{
                  color: '#ef4444',
                  fontSize: 13,
                  marginBottom: 8,
                }}
              >
                Linha vermelha = média geral dos seus scores (
                {Number.isFinite(average) ? average.toFixed(2) : '--'})
              </Text>

              <LineChart
                data={chartData}
                width={screenWidth}
                height={220}
                fromZero
                bezier
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
                  propsForDots: {
                    r: '4',
                  },
                }}
                style={styles.chart}
              />

              <Text
                style={{
                  color: '#9ca3af',
                  fontSize: 12,
                  marginTop: 8,
                }}
              >
                Dica: acompanhe a tendência do gráfico. Subidas constantes indicam aumento
                de estresse ao longo dos dias. Compare seus pontos com a linha de média
                para entender se você está acima ou abaixo do seu padrão.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
      <Hotbar />
    </View>
  );
};

export default ScoresScreen;
