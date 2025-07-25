import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, SafeAreaView, ScrollView } from 'react-native';
// Importaciones actualizadas para Realtime Database
import { auth, database, ref, push, serverTimestamp } from '../Firebase/Config'; 
import { Ionicons } from '@expo/vector-icons';

export default function OperationsScreen() {
  const [idOp, setIdOp] = useState('');
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleSave = async () => {
    console.log("handleSave: Iniciando proceso de guardado.");
    const precioNum = parseFloat(precio);

    if (!idOp || !precio || !cantidad || !descripcion) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      console.log("handleSave: Campos obligatorios vacíos.");
      return;
    }
    if (precioNum < 0) {
      Alert.alert("Error", "El precio no puede ser negativo. La operación no se guardará.");
      console.log("handleSave: Precio negativo detectado.");
      return;
    }

    const saveData = async () => {
        console.log("saveData: Intentando guardar la operación en Realtime Database.");
        try {
            const user = auth.currentUser;
            if (user) {
                console.log("saveData: Usuario autenticado, UID:", user.uid);
                // Usar push para añadir un nuevo elemento con una clave única generada automáticamente
                // La ruta será users/UID_DEL_USUARIO/transactions
                await push(ref(database, 'users/' + user.uid + '/transactions'), {
                    id_operacion: idOp,
                    precio: precioNum,
                    cantidad: parseInt(cantidad, 10),
                    descripcion: descripcion,
                    createdAt: serverTimestamp() // Usamos serverTimestamp de Realtime Database
                });
                console.log("saveData: Operación guardada con éxito en Realtime Database.");
                Alert.alert("Éxito", "La operación se realizó con éxito.");
                setIdOp('');
                setPrecio('');
                setCantidad('');
                setDescripcion('');
            } else {
                console.log("saveData: No hay usuario autenticado.");
                Alert.alert("Error", "No hay usuario autenticado.");
            }
        } catch (error: any) { // Añadido :any para el tipo de error
            console.error("saveData: Error al guardar la operación:", error);
            Alert.alert("Error", "No se pudo guardar la operación: " + error.message); // Muestra el mensaje de error de Firebase
        }
    }

    if (precioNum < 1 || precioNum > 20) {
      console.log("handleSave: Monto fuera de rango ($1 - $20). Mostrando confirmación.");
      Alert.alert(
        "Confirmación",
        "El monto está fuera del rango común ($1 - $20). ¿Desea continuar con la operación?",
        [
          { text: "Cancelar", style: "cancel", onPress: () => console.log("handleSave: Confirmación de monto cancelada.") },
          { text: "Continuar", onPress: saveData }
        ]
      );
    } else {
      console.log("handleSave: Monto dentro de rango. Llamando a saveData directamente.");
      saveData();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Ionicons name="card-outline" size={80} color="#FFF" />
        <Text style={styles.title}>Registrar Operación</Text>
        <TextInput
          style={styles.input}
          placeholder="ID Operación"
          placeholderTextColor="#888"
          value={idOp}
          onChangeText={setIdOp}
        />
        <TextInput
          style={styles.input}
          placeholder="Precio"
          placeholderTextColor="#888"
          value={precio}
          onChangeText={setPrecio}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Cantidad"
          placeholderTextColor="#888"
          value={cantidad}
          onChangeText={setCantidad}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descripción"
          placeholderTextColor="#888"
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Guardar</Text>
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
    formContainer: {
        padding: 20,
        alignItems: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
        textAlign: 'center',
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
    textArea: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: 15,
    },
    button: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#000000',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
