import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyDoQGNAp1VtBC1zSjTl8gKXAH2F37rRvbM",
  authDomain: "whatsapp-clone-5717e.firebaseapp.com",
  projectId: "whatsapp-clone-5717e",
  storageBucket: "whatsapp-clone-5717e.appspot.com",
  messagingSenderId: "1077497708268",
  appId: "1:1077497708268:web:f45d6805ad52356c6fefc9",
};

const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage().ref("images");
const audioStorage = firebase.storage().ref("audios");
const createTimestamp = firebase.firestore.FieldValue.serverTimestamp;
const serverTimestamp = firebase.database.ServerValue.TIMESTAMP;

export {
  db,
  auth,
  provider,
  storage,
  audioStorage,
  createTimestamp,
  serverTimestamp,
};
