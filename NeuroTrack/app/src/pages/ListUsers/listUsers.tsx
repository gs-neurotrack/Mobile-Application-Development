import React, { useEffect, useState, useCallback } from 'react';
import {View, Text, ActivityIndicator, FlatList,  TouchableOpacity,  RefreshControl,Image } from 'react-native';
import { useRouter } from 'expo-router';
import styles from './style';
import { fetchUsersPage, User } from '../../services/authService';
import { ROUTES } from '../../navigation/routes';
import Hotbar from '../../components/HotBar/hotbar';
import GlobalTouchTracker from '../../components/GlobalTouchTracker/globalTouchTracker';

const UI_PAGE_SIZE = 5; 

const AdminUsersScreen = () => {
  const router = useRouter();

  const [allUsers, setAllUsers] = useState<User[]>([]); 
  const [currentPage, setCurrentPage] = useState(1);    
  const [totalPages, setTotalPages] = useState(1);

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState('');

 
  const loadAllUsers = useCallback(async () => {
    try {
      setMessage('');
      setLoadingInitial(true);

      let accumulated: User[] = [];
      let pageBackend = 0;
      let lastBackendPage = false;

      while (!lastBackendPage) {
        const data = await fetchUsersPage(pageBackend, 20); 
        accumulated = [...accumulated, ...data.content];
        lastBackendPage = data.last;
        pageBackend += 1;
      }

      
      const filtered = accumulated.filter((u) => u.id >= 31);

      if (filtered.length === 0) {
        setMessage('Nenhum usuário encontrado com ID a partir de 31.');
      }

      setAllUsers(filtered);

      const pages = Math.max(1, Math.ceil(filtered.length / UI_PAGE_SIZE));
      setTotalPages(pages);
      setCurrentPage(1); 
    } catch (err: any) {
      console.log(err);
      setMessage(err.message || 'Erro ao carregar usuários.');
    } finally {
      setLoadingInitial(false);
      setRefreshing(false);
    }
  }, []);


  useEffect(() => {
    loadAllUsers();
  }, [loadAllUsers]);

  const onRefresh = () => {
    setRefreshing(true);
    loadAllUsers();
  };

  const getRoleName = (user: User): string => {
    if (user.role?.name) return user.role.name;
    return 'Cargo não informado';
  };

  const handleOpenUserDetails = (user: User) => {
    router.push({
      pathname: ROUTES.SCORES_ADMIN, 
      params: {
        userId: String(user.id),
        userName: user.name,
      },
    });
  };


  const startIndex = (currentPage - 1) * UI_PAGE_SIZE;
  const endIndex = startIndex + UI_PAGE_SIZE;
  const usersPage = allUsers.slice(startIndex, endIndex);

  if (loadingInitial) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator />
        <Text style={{ marginTop: 10 }}>Carregando usuários...</Text>
      </View>
    );
  }

  return (
    <GlobalTouchTracker>
      <View style={styles.container}>
        
        <View style={styles.header}>
        <Image
          source={require('../../img/logo_neuro_track_branca.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Meu histórico de estresse</Text>
      </View>


        {message ? <Text style={styles.errorText}>{message}</Text> : null}

        {usersPage.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum usuário encontrado.</Text>
          </View>
        ) : (
          <>
            <FlatList
              data={usersPage}
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
            />

          
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  currentPage === 1 && styles.paginationButtonDisabled,
                ]}
                disabled={currentPage === 1}
                onPress={() =>
                  setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
                }
              >
                <Text
                  style={[
                    styles.paginationButtonText,
                    currentPage === 1 && styles.paginationButtonTextDisabled,
                  ]}
                >
                  Anterior
                </Text>
              </TouchableOpacity>

              <Text style={styles.paginationInfo}>
                Página {currentPage} de {totalPages}
              </Text>

              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  currentPage === totalPages && styles.paginationButtonDisabled,
                ]}
                disabled={currentPage === totalPages}
                onPress={() =>
                  setCurrentPage((prev) =>
                    prev < totalPages ? prev + 1 : prev
                  )
                }
              >
                <Text
                  style={[
                    styles.paginationButtonText,
                    currentPage === totalPages &&
                      styles.paginationButtonTextDisabled,
                  ]}
                >
                  Próxima
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <Hotbar />
      </View>
    </GlobalTouchTracker>
  );
};

export default AdminUsersScreen;
