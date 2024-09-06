import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD3VP5ofhdEoW92wobi5GsglvEQsCfZBfY",
  authDomain: "chatconnect-d8205.firebaseapp.com",
  projectId: "chatconnect-d8205",
  storageBucket: "chatconnect-d8205.appspot.com",
  messagingSenderId: "1079779206747",
  appId: "1:1079779206747:web:0c2991b9cee1ef80f9c17e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();