import React from 'react';
import { View } from 'react-native';
import Socket from './Socket';

const App = () => (
  <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
    <Socket />
  </View>
);

export default App;
