import React from 'react';
import * as firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyC4vj4x04WKLj1ffrX57tm232RNJ6ULIqE",
    authDomain: "webapp-ef989.firebaseapp.com",
    databaseURL: "https://webapp-ef989.firebaseio.com",
    projectId: "webapp-ef989",
    storageBucket: "webapp-ef989.appspot.com",
    messagingSenderId: "306981058280",
    appId: "1:306981058280:web:fc528cbdf00cdc003f7b5d",
    measurementId: "G-E5ETZ5M3HJ"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase

