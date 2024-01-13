// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
// import {getAnalytics} from 'firebase/analytics';
import {getDatabase} from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDRVajU4NOrvOR7L5g65N0TpdhJfmX_C58',
  authDomain: 'methapp-2.firebaseapp.com',
  databaseURL:
    'https://methapp-2-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'methapp-2',
  storageBucket: 'methapp-2.appspot.com',
  messagingSenderId: '230078794220',
  appId: '1:230078794220:web:9d192b887ab2431b5298c9',
  measurementId: 'G-M73RL11TFR',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db = getDatabase(app);
