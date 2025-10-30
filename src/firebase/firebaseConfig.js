// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBBvaa1E3kNu8-vssMLLuDNodQcEYOstqo",
  authDomain: "coloc-app-e50ae.firebaseapp.com",
  projectId: "coloc-app-e50ae",
  storageBucket: "coloc-app-e50ae.firebasestorage.app",
  messagingSenderId: "1098790900867",
  appId: "1:1098790900867:web:5fdd8a08deb161eab677b6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
