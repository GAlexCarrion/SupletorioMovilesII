import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { auth, firestore } from '../Firebase/Config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !username || !phone) {
      Alert.alert("Error", "Por favor, complete todos los campos.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(firestore, 'users', user.uid), {
        username: username,
        phone: phone,
        email: user.email
      });

      Alert.alert("Registro Exitoso", "Usuario registrado correctamente.", [
        { text: "OK", onPress: () => navigation.navigate('Login') }
      ]);

    } catch (error: any) {
      Alert.alert("Error de Registro", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <Ionicons name="person-add" size={80} color="#FFF" style={{ marginBottom: 20 }}/>
      <TextInput
        style={styles.input}
        placeholder="Ingrese correo"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Ingrese contraseña"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Ingrese nombre de usuario"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Ingrese número de celular"
        placeholderTextColor="#888"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#8B0000', // Fondo rojo oscuro
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFF', // Color del título blanco
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF', // Fondo de los inputs blanco
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#CCC', // Borde más claro para los inputs
    color: '#333', // Color del texto dentro del input
  },
  button: {
    width: '100%',
    backgroundColor: '#FFFFFF', // Fondo del botón blanco
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000', // Texto del botón negro
    fontSize: 18,
    fontWeight: 'bold',
  },
});
