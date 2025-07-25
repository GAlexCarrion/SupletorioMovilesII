import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDOXCJmLXvnozUprxyfmLk1QDLHx2fsCqE",
  authDomain: "gc-prueba.firebaseapp.com",
  projectId: "gc-prueba",
  storageBucket: "gc-prueba.firebasestorage.app",
  messagingSenderId: "429472131650",
  appId: "1:429472131650:web:bc05511e9083e22d565bdb"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
