import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
// Importaciones actualizadas para Realtime Database
import { auth, database, ref, onValue, off } from '../Firebase/Config'; 
import { Ionicons } from '@expo/vector-icons';

const TransactionItem = ({ item, onPress }: { item: any, onPress: () => void }) => {
  console.log("Rendering TransactionItem:", item); 

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <View style={{flex: 1}}>
          <Text style={styles.itemTitle}>{item.descripcion}</Text>
          <Text style={styles.itemSubtitle}>ID: {item.id_operacion}</Text>
      </View>
      <Text style={styles.itemPrice}>${item.precio.toFixed(2)}</Text>
      <Ionicons name="chevron-forward" size={24} color="#333" />
    </TouchableOpacity>
  );
};

export default function HistoryScreen() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      // Referencia a la ubicación de las transacciones del usuario en Realtime Database
      const transactionsRef = ref(database, 'users/' + user.uid + '/transactions');
      
      // onValue es el listener para Realtime Database
      // Se dispara una vez con los datos iniciales y luego cada vez que los datos cambian.
      const unsubscribe = onValue(transactionsRef, (snapshot) => {
        const trans: any[] = [];
        // Iterar sobre los hijos del snapshot (cada transacción)
        snapshot.forEach((childSnapshot) => {
          // childSnapshot.key es la clave única generada por push()
          // childSnapshot.val() son los datos del objeto de la transacción
          trans.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        
        // Ordenar las transacciones por 'createdAt' en orden descendente (más reciente primero)
        // Realtime Database no tiene un orderBy nativo tan flexible como Firestore para timestamps.
        // La ordenación se hace en el cliente después de obtener los datos.
        trans.sort((a, b) => {
          // Asegurarse de que createdAt sea un número (timestamp de Realtime Database)
          // o manejarlo si se guardó como string ISO
          const dateA = typeof a.createdAt === 'number' ? a.createdAt : new Date(a.createdAt).getTime();
          const dateB = typeof b.createdAt === 'number' ? b.createdAt : new Date(b.createdAt).getTime();
          return dateB - dateA; // Para orden descendente
        });
        setTransactions(trans);
      }, (error) => {
        console.error("Error al obtener transacciones de Realtime Database:", error);
        Alert.alert("Error", "No se pudieron cargar las transacciones: " + error.message);
      });

      // La función de limpieza para el listener de Realtime Database
      // off() desvincula el listener cuando el componente se desmonta.
      return () => off(transactionsRef, 'value', unsubscribe);
    } else {
      console.log("No hay usuario autenticado en HistoryScreen.");
      setTransactions([]); // Limpiar transacciones si no hay usuario
    }
  }, []); // El array de dependencias vacío asegura que el efecto se ejecute solo una vez al montar

  const handleItemPress = (item: any) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={transactions}
        renderItem={({ item }) => <TransactionItem item={item} onPress={() => handleItemPress(item)} />}
        keyExtractor={item => item.id}
        ListEmptyComponent={<View style={styles.emptyContainer}><Text style={styles.emptyText}>No hay transacciones registradas.</Text></View>}
        contentContainerStyle={{ padding: 10 }}
      />
      {selectedItem && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalOverlay}>
                <Text style={styles.modalTitle}>Detalle de Operación</Text>
                <Text style={styles.modalText}>ITEM: {selectedItem.descripcion}</Text>
                <Text style={styles.modalText}>CANTIDAD: {selectedItem.cantidad}</Text>
                <Text style={styles.modalText}>PRECIO: ${selectedItem.precio.toFixed(2)}</Text>
                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                    <Text style={styles.closeButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#8B0000',
    },
    itemContainer: {
        backgroundColor: 'white',
        padding: 20,
        marginVertical: 8,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    itemSubtitle: {
        fontSize: 12,
        color: '#666',
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
        marginHorizontal: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50
    },
    emptyText: {
        fontSize: 16,
        color: '#FFF',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalContent: {
        width: '85%',
        height: '40%',
        borderRadius: 20,
        backgroundColor: '#8B0000',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    modalOverlay: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        padding: 30,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'white',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 10,
        color: 'white',
    },
    closeButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 20,
    },
    closeButtonText: {
        color: '#000000',
        fontWeight: 'bold',
    },
});
