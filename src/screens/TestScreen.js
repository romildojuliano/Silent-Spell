import React, { useState } from 'react';
import { View, Text,  StyleSheet, Dimensions, Button } from 'react-native';
import { Audio } from 'expo-av';


const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_FONTSIZE = Dimensions.get('window').fontScale;

const TestScreen = () => {
  const [sound, setSound] = useState();

  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
       require('../../assets/Blouse.mp3')
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync(); 
  }

  React.useEffect(() => {
    return sound? 
      () => {
          console.log('Unloading Sound');
          sound.unloadAsync(); 
      }
      : undefined;
  }, [sound]);

  return (
    <View style={{ marginTop: SCREEN_HEIGHT * .5, width: 200, height: 75, alignSelf: 'center' }}>
      <Button title="Play Sound" onPress={playSound} />
    </View>
  );
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