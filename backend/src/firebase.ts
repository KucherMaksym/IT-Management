// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBviw0uXh8ORHyBOkSLqNgkCqOBte2NHEg",
  authDomain: "it-managment-d88a9.firebaseapp.com",
  projectId: "it-managment-d88a9",
  storageBucket: "it-managment-d88a9.appspot.com",
  messagingSenderId: "802163065009",
  appId: "1:802163065009:web:4158c7d1119f12e499e290",
  measurementId: "G-8B96GQ8V8N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);