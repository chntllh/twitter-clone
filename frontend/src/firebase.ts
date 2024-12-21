// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "z-clonee.firebaseapp.com",
  projectId: "z-clonee",
  storageBucket: "z-clonee.appspot.com",
  messagingSenderId: "236629882843",
  appId: "1:236629882843:web:7f39dc27bd28fe4102d9fe"
};

// Initialize Firebase
export const fireapp = initializeApp(firebaseConfig);