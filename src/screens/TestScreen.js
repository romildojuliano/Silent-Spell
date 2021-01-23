import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { useFonts } from 'expo-font';
import { Button } from 'react-native-elements';
import LottieView from 'lottie-react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_FONTSIZE = Dimensions.get('window').fontScale;

const styledText = (pontuation) => <Text style={{ fontSize: SCREEN_FONTSIZE * 20, color: 'yellow', fontWeight: 'bold' }}>{pontuation}</Text>

const TestScreen = () => {
  const heart = () => <LottieView source={require('../../assets/4894-heart.json')} loop autoPlay style={{ height: SCREEN_HEIGHT * .1, width: SCREEN_WIDTH * .15 }}/>
  return (
    <View style={styles.viewStyle}>
      <ScrollView horizontal={true} style={{ width: SCREEN_WIDTH * .48 , height: SCREEN_HEIGHT * .1, marginTop: SCREEN_HEIGHT * .05, position: 'absolute' }}>
        {heart()}
        {heart()}
        {heart()}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  modalTextStyle: {
    fontWeight: 'bold', 
    textAlign: 'center', 
    alignSelf: 'center',
    paddingTop: SCREEN_HEIGHT * .29, 
    position: 'absolute',
    fontSize: Dimensions.get('screen').fontScale * 35
  },
  modalSubTextStyle: {
    fontWeight: 'bold', 
    textAlign: 'center', 
    alignSelf: 'center',
    paddingTop: SCREEN_HEIGHT * .35, 
    position: 'absolute',
    fontSize: Dimensions.get('screen').fontScale * 22
  },
  textStyle: {
    textAlign: 'center',
    alignContent: 'center',
    borderColor: 'blue',
    borderWidth: 1,
    marginTop: SCREEN_HEIGHT * .5,
    marginBottom: SCREEN_HEIGHT * .01,
  },
  viewStyle: {
    borderColor: 'red',
    borderWidth: 1,
    alignItems: 'center',
    alignContent: 'center',
    flex: 1,

  },
  ButtonStd: { 
    alignSelf: 'center', 
    borderRadius: 30,
    backgroundColor: '#FF6F61',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    fontWeight: 'bold',
    width: Dimensions.get('window').width * .6,
    height: Dimensions.get('window').height * .1
  },
});

export default TestScreen;