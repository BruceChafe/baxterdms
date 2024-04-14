import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBpX8MWL084JX66mbTF05oyNsl2Nk1Q1y0",
  authDomain: "baxterdms.firebaseapp.com",
  projectId: "baxterdms",
  storageBucket: "baxterdms.appspot.com",
  messagingSenderId: "551233854379",
  appId: "1:551233854379:web:35859908d54953f3c9d0ee",
  measurementId: "G-99XTCW5SY5"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export { auth, db };
