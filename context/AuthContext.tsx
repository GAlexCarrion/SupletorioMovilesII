import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
// Importaciones actualizadas para Realtime Database
import { auth, database, ref, onValue, off } from '../Firebase/Config';
import { onAuthStateChanged, User } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  userData: any | null; 
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, userData: null, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(true); // Establecer loading a true mientras se carga userData

      if (currentUser) {
        // Crear una referencia a la ubicación del usuario en Realtime Database
        const userRef = ref(database, 'users/' + currentUser.uid);
        
        // Escuchar cambios en los datos del usuario en Realtime Database
        const unsubscribeDb = onValue(userRef, (snapshot) => {
          if (snapshot.exists()) {
            setUserData(snapshot.val()); // Obtener los datos del usuario
            console.log("UserData cargado de Realtime Database:", snapshot.val()); // Debug log
          } else {
            setUserData(null);
            console.log("No se encontraron datos para el usuario en Realtime Database."); // Debug log
          }
          setLoading(false); // Datos cargados, establecer loading a false
        }, (error) => {
          console.error("Error al obtener datos del usuario de Realtime Database:", error);
          setUserData(null);
          setLoading(false); // En caso de error, también establecer loading a false
        });

        // Retornar una función de limpieza para el listener de Realtime Database
        return () => off(userRef, 'value', unsubscribeDb);

      } else {
        setUserData(null);
        setLoading(false); // Si no hay usuario, establecer loading a false
      }
    });

    // Retornar una función de limpieza para el listener de autenticación
    return () => unsubscribeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
