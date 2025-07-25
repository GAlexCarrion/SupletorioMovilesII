import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// Importaciones específicas para Realtime Database
import { getDatabase, ref, set, push, onValue, off, serverTimestamp } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDOXCJmLXvnozUprxyfmLk1QDLHx2fsCqE",
  authDomain: "gc-prueba.firebaseapp.com",
  projectId: "gc-prueba",
  storageBucket: "gc-prueba.firebasestorage.app",
  messagingSenderId: "429472131650",
  appId: "1:429472131650:web:bc05511e9083e22d565bdb",
  // ¡MUY IMPORTANTE para Realtime Database! Asegúrate de que esta URL es correcta para tu proyecto.
  databaseURL: "https://gc-prueba-default-rtdb.firebaseio.com" 
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
// Exportamos el servicio de Realtime Database
export const database = getDatabase(app);

// Exportamos las funciones comunes de Realtime Database para fácil acceso
export { ref, set, push, onValue, off, serverTimestamp };
