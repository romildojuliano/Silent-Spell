import React from 'react';
import { useFonts } from 'expo-font';
import { StyleSheet, Dimensions, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import RegisterForm from '../components/RegisterForm';

const RegisterButton = (navigation) => { 
  return (
    <TouchableOpacity style={styles.containerButton}>
      <Button 
        title='CADASTRAR'
        buttonStyle={styles.buttonStyle}
        titleStyle={{ 
          fontFamily: 'OpenSans-Bold', 
          fontWeight: 'bold', 
          textShadowColor: 'rgba(0, 0, 0, 1)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 1, 
        }}
        onPress={() => navigation.navigate('Auth')}
      />
    </TouchableOpacity>
  );
}

const RegisterScreen = ({ navigation }) => {
  let [fontsLoaded] = useFonts({
    'LakkiReddy-Regular': require('../../assets/LakkiReddy-Regular.ttf'),
    'OpenSans-Bold': require('../../assets/OpenSans-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return <></>;
  }
  else {
    return (
      <View style={styles.absoluteBackground}>       
        <RegisterForm />
        {RegisterButton(navigation)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  absoluteBackground: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height * 1.25,
    backgroundColor: '#263056',
    flex: 1,
    paddingTop: Dimensions.get('screen').height * .05
  },
  textStyle: {
    fontFamily: 'LakkiReddy-Regular', 
    fontSize: Dimensions.get('window').width * .125, 
    textAlign: 'center', 
    color: '#fc9e21',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5
  },
  inputStyle:{
    // Box related
    width: Dimensions.get('window').width * .85,
    height: Dimensions.get('window').height * .07,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#dbdfef',
    borderBottomWidth: 2,
    borderRadius: 10,
    // Font Related
    fontFamily: 'LakkiReddy-Regular', 
    fontSize: Dimensions.get('window').height * .03,
    textAlignVertical: 'bottom',
    color: '#564c26',
    alignSelf: 'center'
  },
  containerButton: { 
    flex: 1, 
    position: 'absolute', 
    alignItems: 'center', 
    alignSelf: 'center', 
    alignContent: 'center',
    marginTop: Dimensions.get('window').height * .83,
  },
  buttonStyle: {
    width: Dimensions.get('window').width * .6,
    height: Dimensions.get('window').height * .075,
    borderRadius: 30,
    backgroundColor: '#FF6F61',
    borderBottomWidth: 2,
    borderBottomColor: '#000'
  },
});

export default RegisterScreen;