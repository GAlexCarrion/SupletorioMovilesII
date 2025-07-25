import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, TouchableOpacity, SafeAreaView } from 'react-native';
import { firestore, auth } from '../Firebase/Config'; 
import { collection, onSnapshot, query } from 'firebase/firestore'; 
import { Ionicons } from '@expo/vector-icons'; 

const TransactionItem = ({ item, onPress }: { item: any, onPress: () => void }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
    <View style={{flex: 1}}>
        <Text style={styles.itemTitle}>{item.descripcion}</Text>
        <Text style={styles.itemSubtitle}>ID: {item.id_operacion}</Text>
    </View>
    <Text style={styles.itemPrice}>${item.precio.toFixed(2)}</Text>
    <Ionicons name="chevron-forward" size={24} color="#333" /> 
  </TouchableOpacity>
);

export default function HistoryScreen() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(firestore, 'users', user.uid, 'transactions'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const trans: any[] = [];
        querySnapshot.forEach((doc) => {
          trans.push({ id: doc.id, ...doc.data() });
        });
        trans.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
          return dateB - dateA;
        });
        setTransactions(trans);
      });
      return () => unsubscribe();
    }
  }, []);

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
