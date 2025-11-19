import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import styles from './style';
import { fetchUsersPage, User } from '../../services/authService';
import { ROUTES } from '../../navigation/routes';

const PAGE_SIZE = 5; // 👈 pode ser 1, 5, 10... mas bate com "itens"

const AdminUsersScreen = () => {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);          // 👈 começa em 0
  const [isLastPage, setIsLastPage] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState('');

  const loadPage = useCallback(
    async (pageToLoad: number, replace: boolean = false) => {
      try {
        if (replace) {
          setMessage('');
        }

        const data = await fetchUsersPage(pageToLoad, PAGE_SIZE);

        setIsLastPage(data.last);

        if (replace) {
          setUsers(data.content);
        } else {
          setUsers((prev) => [...prev, ...data.content]);
        }

        // 👇 controla a página atual pelo que você pediu
        setPage(pageToLoad);
      } catch (err: any) {
        console.log(err);
        setMessage(err.message || 'Erro ao carregar usuários.');
      } finally {
        setLoadingInitial(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    []
  );

  // Carregamento inicial
  useEffect(() => {
    loadPage(0, true);   // 👈 primeira página = 0
  }, [loadPage]);

  const onRefresh = () => {
    setRefreshing(true);
    setIsLastPage(false);
    loadPage(0, true);   // 👈 recarrega a página 0
  };

  const loadMore = () => {
    if (loadingMore || isLastPage || loadingInitial) return;

    setLoadingMore(true);
    const nextPage = page + 1;   // 0 → 1 → 2...
    loadPage(nextPage, false);
  };

  const getRoleName = (user: User): string => {
    if (user.role?.name) return user.role.name;
    return 'Cargo não informado';
  };

  const handleOpenUserDetails = (user: User) => {
    // FUTURA TELA de detalhes -> por enquanto você está mandando pro MENU
    router.push({
      pathname: ROUTES.MENU,
      params: { userId: String(user.id) },
    });
  };

  if (loadingInitial) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator />
        <Text style={{ marginTop: 10 }}>Carregando usuários...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER SIMPLES */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Usuários cadastrados</Text>
      </View>

      {message ? <Text style={styles.errorText}>{message}</Text> : null}

      {users.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum usuário encontrado.</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => String(item.id)}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.userCard}
              onPress={() => handleOpenUserDetails(item)}
            >
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userRole}>{getRoleName(item)}</Text>
            </TouchableOpacity>
          )}
          onEndReachedThreshold={0.4}
          onEndReached={loadMore}
          ListFooterComponent={
            loadingMore ? (
              <View style={{ paddingVertical: 10 }}>
                <ActivityIndicator />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

export default AdminUsersScreen;
