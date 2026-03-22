import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDir7-igPKWVB9HheWwFgnr3U9zwllT06k",
  authDomain: "mi-catalogo-72325.firebaseapp.com",
  projectId: "mi-catalogo-72325",
  storageBucket: "mi-catalogo-72325.firebasestorage.app",
  messagingSenderId: "630128099945",
  appId: "1:630128099945:web:ddbef29587ce1320db58f8"
};

var app = initializeApp(firebaseConfig);
var db = getFirestore(app);
var storage = getStorage(app);
var auth = getAuth(app);

export { db, storage, auth };