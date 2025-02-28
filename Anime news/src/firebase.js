import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Verifica se todas as variáveis de ambiente necessárias estão presentes
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_FIREBASE_MEASUREMENT_ID'
];

const missingEnvVars = requiredEnvVars.filter(
  (varName) => !import.meta.env[varName]
);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Variáveis de ambiente ausentes: ${missingEnvVars.join(', ')}. ` +
    'Verifique se o arquivo .env está configurado corretamente.'
  );
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

let app;
let auth;
let db;
let storage;

try {
  console.log('Iniciando configuração do Firebase...');
  app = initializeApp(firebaseConfig);
  console.log('Firebase inicializado com sucesso');

  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  // Verifica se está em ambiente de desenvolvimento
  if (import.meta.env.DEV) {
    console.log('Ambiente de desenvolvimento detectado');
  }

  console.log('Autenticação, Firestore e Storage configurados');
} catch (error) {
  console.error('Erro ao inicializar o Firebase:', error);
  throw error;
}

export { auth, db, storage };
export default app; 