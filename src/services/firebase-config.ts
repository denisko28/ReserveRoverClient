import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBZqLfrswhLrNdq9bDcrf4H7zzwnrTuBJk",
  authDomain: "reserverover-107c6.firebaseapp.com",
  projectId: "reserverover-107c6",
  storageBucket: "reserverover-107c6.appspot.com",
  messagingSenderId: "558913596443",
  appId: "1:558913596443:web:e39f6a6790c99d8cf71cbe",
  measurementId: "G-KSDYGYHGF2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
// auth.language = "uk";
