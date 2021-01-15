import React, { useState } from 'react';
import { useFonts } from 'expo-font';
import { StyleSheet, Dimensions, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Button } from 'react-native-elements';
import firebase from 'firebase';

const RegisterScreen = ({ navigation }) => {
  let [fontsLoaded] = useFonts({
    'LakkiReddy-Regular': require('../../assets/LakkiReddy-Regular.ttf'),
    'OpenSans-Bold': require('../../assets/OpenSans-Bold.ttf'),
  });
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [samePassword, setSamePassword] = useState('');
  

  if (!fontsLoaded) {
    return <></>;
  }
  else {
    return (
      <KeyboardAvoidingView style={{ 
        backgroundColor: '#263056', flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.absoluteBackground}>       
          <Text style={styles.textStyle}>Cadastro</Text>
          <Text style={[styles.textStyle, { fontSize: Dimensions.get('window').width * .08 }]}>
            Nome de usuário
          </Text>
          <TextInput 
          underlineColorAndroid="transparent"
          allowFontScaling
          autoCapitalize='none'
          autoCompleteType='username'
          autoCorrect={false}
          caretHidden
          clearButtonMode='while-editing'
          keyboardType='ascii-capable'
          value={username}
          onChangeText={(username) => setUsername(username)}
          returnKeyType='next'
          selectionColor='purple'
          textAlign='center'
          textContentType='username'
          style={styles.inputStyle}
          />

          <Text style={[styles.textStyle, { fontSize: Dimensions.get('window').width * .08, paddingTop: Dimensions.get('window').height * .0175 }]}>
            Email
          </Text>
          <TextInput 
          underlineColorAndroid="transparent"
          allowFontScaling
          autoCapitalize='none'
          autoCompleteType='email'
          autoCorrect={false}
          caretHidden
          clearButtonMode='while-editing'
          keyboardType='email-address'
          value={email}
          onChangeText={(email) => setEmail(email)} 
          returnKeyType='next'
          selectionColor='purple'
          textAlign='center'
          textContentType='emailAddress'
          style={styles.inputStyle}
          />

          <Text style={[styles.textStyle, { fontSize: Dimensions.get('window').width * .08, paddingTop: Dimensions.get('window').height * .0175 }]}>
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
          value={password}
          onChangeText={(password) => setPassword(password)}
          returnKeyType='next'
          selectionColor='purple'
          textAlign='center'
          secureTextEntry
          textContentType='password'
          style={styles.inputStyle}
          />

          <Text style={[styles.textStyle, { fontSize: Dimensions.get('window').width * .078, paddingTop: Dimensions.get('window').height * .03 }]}>
            Digite a senha novamente
          </Text>
          <TextInput 
          underlineColorAndroid="transparent"
          allowFontScaling
          autoCapitalize='none'
          autoCompleteType='password'
          autoCorrect={false}
          caretHidden
          clearButtonMode='while-editing'
          secureTextEntry
          value={samePassword}
          onChangeText={(samePassword) => setSamePassword(samePassword)}
          returnKeyType='next'
          selectionColor='purple'
          textAlign='center'
          textContentType='password'
          style={styles.inputStyle}
          />
          {RegisterButton(navigation, username, email, password, samePassword)}
        </View>
      </KeyboardAvoidingView>
      
    );
  }
}

const RegisterButton = (navigation, username, email, password, samePassword) => { 
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
        onPress={() => {
          console.log('REGISTER SCREEN');
          console.log('username:', username, ', email: ', email, ', password:', password, ', samePassword:', samePassword);
          if (password != samePassword) {
            console.log('As senhas não coincidem');
          }

          else if (password.length < 6) {
            console.log('password.length deve ser maior ou igual a 6')
          }

          else if (username.length <= 0 || username.length > 20) {
            console.log('username.length deve ser maior que zero e menor que 20')
          }

          else {
            firebase.auth().createUserWithEmailAndPassword(email.replace(' ', ''), password)
              .then(() => {
                const { currentUser } = firebase.auth();
                firebase.database().ref(`/users/${currentUser.uid}/userData`)
                  .push({ username, email, password, level: 0, skill: 0, wins: 0, defeats: 0 })
                  .catch((err) => {
                    console.log(err);
                  })
                console.log('Login efetuado com sucesso!');
                navigation.navigate('Auth');
              })
              .catch((err) => {
                console.log(err)
              })
          }
        }}
      />
    </TouchableOpacity>
  );
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