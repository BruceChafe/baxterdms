// Import necessary functions from the 'firebase' library
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration object containing API keys and project details
const firebaseConfig = {
  apiKey: "AIzaSyBpX8MWL084JX66mbTF05oyNsl2Nk1Q1y0",
  authDomain: "baxterdms.firebaseapp.com",
  projectId: "baxterdms",
  storageBucket: "baxterdms.appspot.com",
  messagingSenderId: "551233854379",
  appId: "1:551233854379:web:35859908d54953f3c9d0ee",
  measurementId: "G-99XTCW5SY5"
};

// Initialize the Firebase app with the provided configuration
const firebaseApp = initializeApp(firebaseConfig);

// Get the authentication object from the initialized Firebase app
const auth = getAuth(firebaseApp);

// Export the 'auth' object for use in other parts of the application
export { auth };
