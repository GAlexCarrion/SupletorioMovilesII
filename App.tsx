import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './navigations/MainNavigator';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    // AuthProvider envuelve toda la aplicación para que cualquier
    // componente pueda acceder al estado de autenticación.
    <AuthProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
