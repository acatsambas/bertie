// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAImzJ7HQ76jTfYIlQ_zfJNAGfFmp1yJxQ",
  authDomain: "bertie-e2b7c.firebaseapp.com",
  projectId: "bertie-e2b7c",
  storageBucket: "bertie-e2b7c.appspot.com",
  messagingSenderId: "676639713902",
  appId: "1:676639713902:web:6ca1ad00bdc5bf5555147f",
  measurementId: "G-8BFDFQ2F0G",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
