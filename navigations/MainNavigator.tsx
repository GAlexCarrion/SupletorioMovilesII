import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native'; // Importar StyleSheet

import AuthNavigator from '../navigations/AuthNavigator';
import AppTabs from '../navigations/AppTabs'; // Asegúrate de que AppTabs esté correctamente importado

const Stack = createStackNavigator();

export default function MainNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // Si el usuario está autenticado, muestra las pestañas de la aplicación
        <Stack.Screen name="App" component={AppTabs} />
      ) : (
        // Si el usuario NO está autenticado, muestra el navegador de autenticación
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8B0000', // Fondo rojo consistente para la pantalla de carga
  },
});
