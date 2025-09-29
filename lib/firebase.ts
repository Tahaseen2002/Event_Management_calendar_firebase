import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDKx0aJp0FmJulmgiAvRKU7r0ZmKx_H88Q",
  authDomain: "invoiceauditgenerator.firebaseapp.com",
  projectId: "invoiceauditgenerator",
  storageBucket: "invoiceauditgenerator.firebasestorage.app",
  messagingSenderId: "242537435964",
  appId: "1:242537435964:web:f244580083a093d5e80439",
  measurementId: "G-2443JG7LTL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;