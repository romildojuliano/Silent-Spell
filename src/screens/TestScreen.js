import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import { Button } from 'react-native-elements';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const TestScreen = (navigation, pontuation) => {
  const [modal, setModal] = useState(false);
  let [fontsLoaded] = useFonts({
    'LakkiReddy-Regular': require('../../assets/LakkiReddy-Regular.ttf'),
    'OpenSans-Bold': require('../../assets/OpenSans-Bold.ttf'),
  });

  if (!fontsLoaded) return <></>;

  return (
    <View style={styles.viewStyle}>
      <Text style={{ ...styles.textStyle }}>
        Teste
      </Text>

      <TouchableOpacity>
        <Button 
          title='Modal'
          onPress={() => setModal(true)}
        />
      </TouchableOpacity>
      
      <Modal 
        animationType='slide'
        hardwareAccelerated
        visible={modal}
        onRequestClose={() => setModal(false)}
        transparent
      >
        <Text style={styles.modalTextStyle}>Fim de jogo</Text>
        <Text style={[styles.modalSubTextStyle ]}>Pontuação: {pontuation} </Text>
        <View style={{ flex: 1, borderColor: 'red', borderWidth: 1 }}>
          <TouchableOpacity style={{ marginTop: SCREEN_HEIGHT * .4 }}>
            <Button 
              title='Jogar novamente'
              onPress={() => {}}
              buttonStyle={styles.ButtonStd}
            />
          </TouchableOpacity>

          <TouchableOpacity>
              <Button 
                title='Sair'
                onPress={() => setModal(false)}
                buttonStyle={{ ...styles.ButtonStd, marginTop: SCREEN_HEIGHT * .015 }}
              />
            </TouchableOpacity>
        </View>
      </Modal>
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