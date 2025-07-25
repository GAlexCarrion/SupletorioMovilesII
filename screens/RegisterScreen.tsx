import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
// Importaciones actualizadas para Realtime Database
import { auth, database, ref, set } from '../Firebase/Config'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
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

      // Guardar datos del usuario en Realtime Database
      // La ruta será users/UID_DEL_USUARIO
      await set(ref(database, 'users/' + user.uid), {
        username: username,
        phone: phone,
        email: user.email,
        // Realtime Database no tiene serverTimestamp() directo para este caso de 'set' en el nodo raíz.
        // Se puede usar new Date().toISOString() o firebase.database.ServerValue.TIMESTAMP
        // Si usas ServerValue.TIMESTAMP, el valor se escribirá después de que el servidor lo procese.
        createdAt: new Date().toISOString() 
      });

      Alert.alert("Registro Exitoso", "Usuario registrado correctamente.", [
        { text: "OK", onPress: () => navigation.navigate('Login') }
      ]);

    } catch (error: any) {
      console.error("Error de Registro:", error); // Log para depuración
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
    backgroundColor: '#8B0000',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFF',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#CCC',
    color: '#333',
  },
  button: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
