// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzpPnoAtWVJixhLNyBl7Y_GGBpM7a6uj4",
  authDomain: "sharemoo-c5bee.firebaseapp.com",
  projectId: "sharemoo-c5bee",
  storageBucket: "sharemoo-c5bee.appspot.com",
  messagingSenderId: "404964180817",
  appId: "1:404964180817:web:62a2c3453994e4fc8e8970",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export default storage;
