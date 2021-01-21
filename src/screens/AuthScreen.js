import React, { useState } from 'react';
import { 
  Dimensions, 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import { Button } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import { useFonts } from 'expo-font';
import firebase from 'firebase';

const LoadingScreen = () => { 
  return (
    <>
      <View style={[styles.animatedView, { paddingTop: Dimensions.get('window').height * .45 }]}>  
        <Animatable.Text animation='pulse' easing='ease-out' iterationCount='infinite' style={styles.animatableText}>
          <Text style={[styles.textStyle]}>Silent Spell</Text>
          <LottieView source={require('../../assets/main_screen_loading.json')} loop autoPlay autoSize={false} style={{ width: 100, height: 100, flex: 1, alignSelf: 'center', paddingBottom: 50, position: 'absolute' }} />
        </Animatable.Text>

        <Text style={styles.bottomPageText}>
          Copyright © 2021 Silent Spell. All Rights Reserved
        </Text>
      </View>
    </>
  );
}

const gotoMainScreen = (navigation) => navigation.navigate('Main');

const LoginButton = (email, password, navigation) => { 
  return (
    <TouchableOpacity style={styles.containerButton}>
      <Button 
        title='ENTRAR'
        buttonStyle={styles.buttonStyle}
        titleStyle={{ 
          fontFamily: 'OpenSans-Bold', 
          fontWeight: 'bold', 
          textShadowColor: 'rgba(0, 0, 0, 1)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 1, 
        }}
        onPress={() => {
          firebase.auth().signInWithEmailAndPassword(email, password)
            .then((user) => {
              console.log(`Login realizado com sucesso por ${user.user.email}`);
              navigation.navigate('Main');
            })
            .catch(err => console.log(err))
        }}
      />
    </TouchableOpacity>
  );
}

export default function AuthScreen({ navigation }) {

  let [fontsLoaded] = useFonts({
    'LakkiReddy-Regular': require('../../assets/LakkiReddy-Regular.ttf'),
    'OpenSans-Bold': require('../../assets/OpenSans-Bold.ttf'),
  });

  const [userLoggedIn, setUserLoggedIn] = useState(null);
  const [flag, setFlag] = useState(0);
  const [email, setEmail] = useState('testuser@test.com');
  const [password, setPassword] = useState('123456');


  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      setUserLoggedIn(true);
      setFlag(1);
    }
    else {
      setUserLoggedIn(false);
    }
  })

  if (!fontsLoaded) {
    return <></>;
  }
  else {
    if (flag == 0) {
      setInterval(() => {
        setFlag(1);
      }, 5000);
      
      return LoadingScreen();
      
    }
    else if (flag == 1) {
      switch(userLoggedIn) {
        case true:
          gotoMainScreen(navigation);
      
        case false: 
          return (
            <KeyboardAvoidingView
            style={{ flex: 1 }}
            keyboardVerticalOffset={Dimensions.get('window').height * .05}
            >
              <View style={styles.absoluteBackground}>
                <View style={styles.animatedView}>
                  <Text style={styles.textStyle}>
                    Login
                  </Text>
                  
                  <Text style={[styles.textStyle, { fontSize: Dimensions.get('window').width * .1 }]}>
                    Email
                  </Text>
                  <TextInput 
                    underlineColorAndroid="transparent"
                    allowFontScaling
                    autoCapitalize='none'
                    onChangeText={(email) => setEmail(email)}
                    autoCompleteType='email'
                    autoCorrect={false}
                    caretHidden
                    clearButtonMode='while-editing'
                    keyboardType='email-address'
                    value={email}
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
                    onChangeText={(password) => setPassword(password)}
                    returnKeyType='go'
                    selectionColor='purple'
                    secureTextEntry
                    textContentType='password'
                    style={styles.inputStyle}
                    textAlign='center'
                    value={password}
                  />
                
                </View>
                <TouchableOpacity style={styles.createAccountTextContainer} onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.createAccountText}>
                    Não possui uma conta? Clique aqui
                  </Text>
                </TouchableOpacity>
                {LoginButton(email, password, navigation)}
                
              </View>
            </KeyboardAvoidingView>
          );

          default: 
            return LoadingScreen();

      }
      
        
      }
    }
}

const styles = StyleSheet.create({
  absoluteBackground: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height * 1.25,
    backgroundColor: '#263056',
    flex: 1,
    alignItems: 'center',
  },
  createAccountTextContainer: {
    flex: 1, 
    position: 'absolute', 
    alignItems: 'center', 
    textAlign: 'center',
    alignContent: 'center',
    marginTop: Dimensions.get('window').height * .775
  },
  createAccountText: {
    color: '#dbdfef',
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').width * .045,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  buttonStyle: {
    width: Dimensions.get('window').width * .6,
    height: Dimensions.get('window').height * .075,
    borderRadius: 30,
    backgroundColor: '#FF6F61',
    borderBottomWidth: 2,
    borderBottomColor: '#000'
  },
  containerButton: { 
    flex: 1, 
    position: 'absolute', 
    alignItems: 'center', 
    alignSelf: 'center', 
    alignContent: 'center',
    marginTop: Dimensions.get('window').height * .575,
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
  },
  textStyle: {
    fontFamily: 'LakkiReddy-Regular', 
    fontSize: Dimensions.get('window').width * .15, 
    textAlign: 'center', 
    color: '#fc9e21',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5
  },
  animatedView: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('screen').height * 1.25,
    justifyContent: 'center', 
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#263056',
    paddingBottom: Dimensions.get('window').height * .75,
    position: 'absolute'
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
  bottomPageText: {
    fontFamily: 'OpenSans-Bold',
    textAlignVertical: 'bottom',
    paddingTop: Dimensions.get('window').height * .525,
    color: '#FFFFFF',
    position: 'absolute',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  }
});
