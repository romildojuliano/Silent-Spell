import { createAppContainer, Bottom } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { enableScreens } from 'react-native-screens';

import AuthScreen from './src/screens/AuthScreen';
import RegisterSCreen from './src/screens/RegisterScreen';
import MainScreen from './src/screens/MainScreen';
import TrackHandsScreen from './src/screens/TrackHandsScreen';
import ConfigScreen from './src/screens/ConfigScreen';
import TestScreen from './src/screens/TestScreen';
import Combat from './src/screens/Combat';

import React from 'react';
import firebase from 'firebase';
import { LogBox } from 'react-native';

const navigator = createStackNavigator(
  {
    Auth: AuthScreen,
    TrackHands: TrackHandsScreen,
    Register: RegisterSCreen,
    Main: MainScreen,
    Config: ConfigScreen,
    Test: TestScreen,
    Combat: Combat
  },
  {
    initialRouteName: 'Combat',
    headerMode: 'none',
    mode: Platform.OS === 'ios' ? 'modal' : 'card',
  }
);

const App = createAppContainer(navigator);

export default () => {
  LogBox.ignoreAllLogs();
  enableScreens();

  // Inicializa o firebase
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: 'AIzaSyAbVdnJ6ibh_BZTd9x3s_6xd3iy4ZKSimg',
      authDomain: 'silent-spell.firebaseapp.com',
      databaseURL: 'https://silent-spell-default-rtdb.firebaseio.com',
      projectId: 'silent-spell',
      storageBucket: 'silent-spell.appspot.com',
      messagingSenderId: '1034982706171',
      appId: '1:1034982706171:web:265a655e70f294885f995e',
      measurementId: 'G-N6HML6X587',
    });
    console.log('App iniciado.');
  } else {
    firebase.app();
    console.log('App iniciado.');
  }
  return <App />;
};
