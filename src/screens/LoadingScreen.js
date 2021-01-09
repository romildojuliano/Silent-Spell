import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';

export default function LoadingScreen() {
  useFonts({'LakkiReddy-Regular': require('../../assets/LakkiReddy-Regular.ttf')});
  
  return(
    <View style={styles.animatedView}>
      <Animatable.Text animation='pulse' easing='ease-out' iterationCount='infinite' style={styles.animatableText}>
        <Text style={styles.textStyle}>Silent Spell</Text>
      </Animatable.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: 'LakkiReddy-Regular', 
    fontSize: 59, 
    textAlign: 'center', 
    color: '#fc9e21'
  },
  animatedView: {
    flex: 1, 
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center', 
    alignContent: 'center', 
    backgroundColor: '#9d446e'
  },
  animatableText: {
    textAlign: 'center', 
    textShadowColor: '#000', 
    textShadowRadius: 2
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
