import { initializeApp } from "firebase/app";
import { Platform } from "react-native";
import { 
  initializeAuth, 
  // @ts-ignore
  getReactNativePersistence,
  browserLocalPersistence,
  getAuth
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Suas credenciais do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDDhQm0_qUpE2eAZ7EH-ZvsGmHUuFJWM9g",
  authDomain: "projeto-teac.firebaseapp.com",
  projectId: "projeto-teac",
  storageBucket: "projeto-teac.firebasestorage.app",
  messagingSenderId: "282511976895",
  appId: "1:282511976895:web:6563df0f88cf7a65b6d90a"
};

// Inicializa o App
const app = initializeApp(firebaseConfig);

// Inicializa o Auth com persistência correta para cada plataforma
let authInstance;
if (Platform.OS === 'web') {
  authInstance = initializeAuth(app, {
    persistence: browserLocalPersistence
  });
} else {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

export const auth = authInstance;

// Inicializa o Firestore
export const db = getFirestore(app);
