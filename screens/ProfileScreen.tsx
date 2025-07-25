import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { auth } from '../Firebase/Config';
import { signOut } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { userData } = useAuth();

  // Añadido para depuración: ver el contenido completo de userData
  console.log("ProfileScreen userData:", userData);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error); // Añadido para depuración
      Alert.alert("Error", "No se pudo cerrar la sesión.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información de perfil</Text>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Nombre completo</Text>
                <Text style={styles.infoValue}>{userData?.username}</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Saludo de bienvenida</Text>
                <Text style={styles.infoValue}>{userData?.username}</Text>
            </View>
        </View>
        
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Autorización de uso de datos</Text>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Estado</Text>
                <Text style={[styles.infoValue, {color: '#28A745'}]}>Activado</Text>
            </View>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mantén actualizada tu información</Text>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Número de celular</Text>
                <Text style={styles.infoValue}>{userData?.phone}</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Correo electrónico</Text>
                <Text style={styles.infoValue}>{userData?.email}</Text>
            </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#8B0000',
    },
    section: {
        backgroundColor: 'white',
        marginHorizontal: 15,
        marginTop: 20,
        borderRadius: 10,
        padding: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 15,
        textTransform: 'uppercase',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F2F5',
    },
    infoLabel: {
        fontSize: 16,
        color: '#333',
    },
    infoValue: {
        fontSize: 16,
        color: '#555',
    },
    logoutButton: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        margin: 15,
        marginTop: 30,
    },
    logoutButtonText: {
        color: '#000000',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
