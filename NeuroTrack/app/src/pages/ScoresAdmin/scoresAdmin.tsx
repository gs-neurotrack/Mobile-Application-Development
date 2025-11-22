// src/screens/Scores/ScoresAdminScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, Dimensions,} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';

import styles from './style';
import { ROUTES } from '../../navigation/routes';
import { logout } from '../../services/authService';
import Hotbar from '../../components/HotBar/hotbar';
import {
  fetchPredictionsForUser,
  Prediction,
} from '../../services/predictionsService';

const screenWidth = Dimensions.get('window').width - 32;

const ScoresAdminScreen = () => {
  const router = useRouter();

 
  const params = useLocalSearchParams<{
    userId?: string;
    userName?: string;
  }>();

  const selectedUserId = params.userId ? Number(params.userId) : NaN;
  const selectedUserName = params.userName ?? '';

  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setMessage('');

        if (!selectedUserId || Number.isNaN(selectedUserId)) {
          setMessage(
            'Usuário não informado para visualizar as predições. Volte para a lista e selecione um colaborador.'
          );
          setPredictions([]);
          return;
        }

        const data = await fetchPredictionsForUser(selectedUserId);

        if (!data || data.length === 0) {
          setMessage(
            'Ainda não há previsões calculadas para este usuário.\n' +
              'Assim que houver dados suficientes de scores, as predições serão geradas.'
          );
          setPredictions([]);
          return;
        }

        const ordered = [...data].sort((a, b) => {
          const da = new Date(a.datePredicted).getTime();
          const db = new Date(b.datePredicted).getTime();
          return da - db;
        });

        setPredictions(ordered);
      } catch (err: any) {
        console.log('[ScoresAdminScreen] erro:', err);

        if (err.message?.includes('Usuário não autenticado')) {
          await logout();
          router.replace(ROUTES.LOGIN);
          return;
        }

        setMessage(
          err.message ||
            'Não foi possível carregar as predições. Tente novamente mais tarde.'
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router, selectedUserId]);

  const labels = predictions.map((p) => {
    const d = new Date(p.datePredicted);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  });

  const values = predictions.map((p) => p.stressPredicted);

  const average =
    values.reduce((sum, v) => sum + v, 0) / (values.length || 1);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        color: (opacity = 1) => `rgba(96, 165, 250, ${opacity})`, 
        strokeWidth: 2,
      },
      {
        data: values.map(() => average),
        color: () => `rgba(239, 68, 68, 1)`, 
        strokeWidth: 2,
        withDots: false,
      },
    ],
  };

  const getRiskInfo = (score: number) => {
    if (score <= 20) {
      return {
        label: 'Baixo risco futuro',
        color: '#22c55e',
        description: 'A previsão indica baixo risco de estresse nas próximas horas/dias.',
      };
    }
    if (score <= 50) {
      return {
        label: 'Risco moderado futuro',
        color: '#eab308',
        description:
          'Previsão moderada. Vale acompanhar mais de perto a carga de trabalho.',
      };
    }
    if (score <= 80) {
      return {
        label: 'Risco alto futuro',
        color: '#f97316',
        description:
          'Previsão de estresse elevado. Considere intervenções preventivas ou redistribuição de tarefas.',
      };
    }
    return {
      label: 'Risco crítico futuro',
      color: '#ef4444',
      description:
        'Previsão crítica. Recomenda-se ação imediata para evitar burnout.',
    };
  };

  const lastPrediction =
    predictions.length > 0 ? predictions[predictions.length - 1] : null;

  const highestPrediction =
    predictions.length > 0
      ? predictions.reduce((prev, curr) =>
          curr.stressPredicted > prev.stressPredicted ? curr : prev
        )
      : null;

  const lastPredictionRisk = lastPrediction
    ? getRiskInfo(lastPrediction.stressPredicted)
    : null;

  const highestPredictionRisk = highestPrediction
    ? getRiskInfo(highestPrediction.stressPredicted)
    : null;

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator />
        <Text style={{ marginTop: 10 }}>
          Carregando predições de estresse...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
    
      <View style={styles.header}>
        <Image
          source={require('../../img/logo_neuro_track_branca.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View>
          <Text style={styles.headerTitle}>Visão preditiva (Gestor)</Text>
          {selectedUserName ? (
            <Text style={{ color: '#ffffffff', fontSize: 12 }}>
              Colaborador: {selectedUserName}
               {/* (ID: {selectedUserId || '--'}) */}
            </Text>
          ) : (
            !Number.isNaN(selectedUserId) && (
              <Text style={{ color: '#9ca3af', fontSize: 12 }}>
                ID do colaborador: {selectedUserId}
              </Text>
            )
          )}
        </View>
      </View>

      <ScrollView style={{ width: '100%' }} contentContainerStyle={styles.scrollContent}>
        {message ? <Text style={styles.infoText}>{message}</Text> : null}

        {predictions.length > 0 && (
          <>
           
            {lastPrediction && (
              <View className="card" style={styles.card}>
                <Text style={styles.cardTitle}>Última previsão gerada</Text>

                <Text style={styles.cardScoreValue}>
                  {lastPrediction.stressPredicted.toFixed(2)}
                </Text>

                <Text style={styles.cardDate}>
                  Data da previsão:{' '}
                  {new Date(lastPrediction.datePredicted).toLocaleString('pt-BR')}
                </Text>

                {lastPredictionRisk && (
                  <View style={{ marginTop: 8 }}>
                    <Text
                      style={{
                        fontWeight: '600',
                        color: lastPredictionRisk.color,
                        marginBottom: 4,
                      }}
                    >
                      Nível previsto: {lastPredictionRisk.label}
                    </Text>
                    <Text style={styles.cardHint}>
                      {lastPredictionRisk.description}
                    </Text>
                  </View>
                )}

                <Text style={[styles.cardHint, { marginTop: 8 }]}>
                  Mensagem da IA:{' '}
                  <Text style={{ fontWeight: '600' }}>
                    {lastPrediction.message}
                  </Text>
                </Text>
              </View>
            )}

           
            {highestPrediction && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Maior risco previsto</Text>

                <Text style={styles.cardScoreValue}>
                  {highestPrediction.stressPredicted.toFixed(2)}
                </Text>

                <Text style={styles.cardDate}>
                  Data da previsão:{' '}
                  {new Date(highestPrediction.datePredicted).toLocaleString('pt-BR')}
                </Text>

                {highestPredictionRisk && (
                  <Text
                    style={{
                      marginTop: 8,
                      fontWeight: '600',
                      color: highestPredictionRisk.color,
                    }}
                  >
                    {highestPredictionRisk.label}
                  </Text>
                )}

                <Text style={[styles.cardHint, { marginTop: 4 }]}>
                  Mensagem:{' '}
                  <Text style={{ fontWeight: '600' }}>
                    {highestPrediction.message}
                  </Text>
                </Text>

                <Text style={[styles.cardHint, { marginTop: 8 }]}>
                  Dica para o gestor: use essas informações para planejar pausas,
                  redistribuir tarefas e agir antes que o estresse se torne crítico.
                </Text>
              </View>
            )}

        
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
                Como interpretar as previsões
              </Text>

              <Text style={{ color: '#d1fae5', marginBottom: 8 }}>
                Cada valor representa o nível previsto de estresse do colaborador
                (0 a 100). Diferente do histórico, aqui a pergunta é:
                <Text style={{ fontWeight: '600' }}>
                  {' '}“como ele tende a ficar nas próximas horas/dias?”
                </Text>
              </Text>

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
                <Text style={{ color: '#22c55e' }}>🟢 0 – 20 → Baixo risco</Text>
                <Text style={{ color: '#eab308' }}>🟡 21 – 50 → Risco moderado</Text>
                <Text style={{ color: '#f97316' }}>🟠 51 – 80 → Risco alto</Text>
                <Text style={{ color: '#ef4444' }}>🔴 81 – 100 → Risco crítico</Text>
              </View>
            </View>

         
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>
                Evolução das previsões de estresse
              </Text>

              <Text
                style={{
                  color: '#6b7280',
                  fontSize: 12,
                  marginBottom: 4,
                }}
              >
                Eixo Y: nível de estresse previsto (0 a 100). Eixo X: data de cada
                previsão gerada pela IA.
              </Text>

              <Text
                style={{
                  color: '#ef4444',
                  fontSize: 13,
                  marginBottom: 8,
                }}
              >
                Linha vermelha = média geral das previsões (
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
                  color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
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
                Use este gráfico para identificar tendências futuras. Se as previsões
                estiverem consistentemente acima da média, considere ações preventivas
                antes que o estresse se torne crítico.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
      <Hotbar />
    </View>
  );
};

export default ScoresAdminScreen;
