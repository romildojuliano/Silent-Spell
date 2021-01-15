import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import AuthScreen from './src/screens/AuthScreen';
import TrackHandsScreen from './src/screens/TrackHandsScreen';
import RegisterSCreen from './src/screens/RegisterScreen';
import React from 'react';
import firebase from 'firebase';

const navigator = createStackNavigator(
  {
    Auth: AuthScreen,
    TrackHands: TrackHandsScreen,
    Register: RegisterSCreen
  },
  {
    initialRouteName: 'Auth',
    headerMode: 'none',
    mode: Platform.OS === "ios" ? "modal" : "card"
  }
);

const App = createAppContainer(navigator);

export default () => {
  // Inicializa o firebase
  if (!firebase.apps.length){
    firebase.initializeApp({
      apiKey: "AIzaSyAbVdnJ6ibh_BZTd9x3s_6xd3iy4ZKSimg",
      authDomain: "silent-spell.firebaseapp.com",
      databaseURL: "https://silent-spell-default-rtdb.firebaseio.com",
      projectId: "silent-spell",
      storageBucket: "silent-spell.appspot.com",
      messagingSenderId: "1034982706171",
      appId: "1:1034982706171:web:265a655e70f294885f995e",
      measurementId: "G-N6HML6X587"
    })
    console.log('App iniciado.')
  }
  else {
    firebase.app();
    console.log('App iniciado.');
  }
  return (
    <App />
  )
  
}