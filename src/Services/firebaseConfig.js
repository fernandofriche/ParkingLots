import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCbeMbi3CdZ8eEkTzotuO-ygMq9K8q4Ykw",
  authDomain: "react-parking-lots.firebaseapp.com",
  projectId: "react-parking-lots",
  storageBucket: "react-parking-lots.appspot.com",
  messagingSenderId: "188287704739",
  appId: "1:188287704739:web:39b7f41648c271eaa3a916",
  measurementId: "G-6HBR6L44SZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
