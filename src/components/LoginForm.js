import { Text, TextInput, View, KeyboardAvoidingView, StyleSheet, Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import React, { useState } from 'react';

const LoginForm = () => {

  let [fontsLoaded] = useFonts({
    'LakkiReddy-Regular': require('../../assets/LakkiReddy-Regular.ttf'),
    'OpenSans-Bold': require('../../assets/OpenSans-Bold.ttf'),
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!fontsLoaded) {
    return <></>;
  }
  
  else {
    return (
      <View style={[styles.absoluteBackground], { paddingTop: Dimensions.get('window').height * .065 }}>
        <View style={styles.animatedView}>
          <Text style={styles.textStyle}>
            Login
          </Text>
          
          <Text style={[styles.textStyle, { fontSize: Dimensions.get('window').width * .1 }]}>
            Nome de usuário
          </Text>
          <TextInput 
            underlineColorAndroid="transparent"
            allowFontScaling
            autoCapitalize='none'
            value={email}
            onChangeText={setEmail}
            autoCompleteType='email'
            autoCorrect={false}
            caretHidden
            clearButtonMode='while-editing'
            keyboardType='email-address'
            onSubmitEditing={(emailInput) => setEmail(emailInput)} // Função realizada ao pressionar buttão 'Enter'
            returnKeyType='done'
            selectionColor='purple'
            textAlign='center'
            textContentType='emailAddress'
            style={styles.inputStyle}
          />

          <Text style={[styles.textStyle, { fontSize: Dimensions.get('window').width * .1, paddingTop: Dimensions.get('window').height * .0175 }]}>
            Senha
          </Text>
          <TextInput 
            underlineColorAndroid="transparent"
            allowFontScaling
            autoCapitalize='none'
            autoCompleteType='password'
            autoCorrect={false}
            caretHidden
            clearButtonMode='while-editing'
            keyboardType='default'
            onSubmitEditing={() => {}} // Função realizada ao pressionar buttão 'Enter'
            onChangeText={(passwordInput) => setPassword(passwordInput)}
            returnKeyType='go'
            selectionColor='purple'
            secureTextEntry
            textContentType='password'
            style={styles.inputStyle}
            textAlign='center'
            value={password}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: 'LakkiReddy-Regular', 
    fontSize: Dimensions.get('window').width * .15, 
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
    alignSelf: 'center',
    // Font Related
    fontFamily: 'LakkiReddy-Regular', 
    fontSize: Dimensions.get('window').height * .03,
    textAlignVertical: 'bottom',
    color: '#564c26',
  },
  absoluteBackground: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height * 1.25,
    backgroundColor: '#263056',
    flex: 1
  },
});

export default LoginForm;