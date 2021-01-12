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

const LoadingScreen = () => {
  return (
    <View style={styles.animatedView}>
      <Animatable.Text animation='pulse' easing='ease-out' iterationCount='infinite' style={styles.animatableText}>
        <Text style={styles.textStyle}>Silent Spell</Text>
        <LottieView source={require('./assets/main_screen_loading.json')} loop autoPlay autoSize={false} style={{ width: 100, height: 100, flex: 1, alignSelf: 'center', paddingBottom: 50, position: 'absolute' }} />
      </Animatable.Text>

      <Text style={styles.bottomPageText}>
        Copyright © 2021 Silent Spell. All Rights Reserved
      </Text>
    </View>
  );
}

const LoginForm = () => {
  return (
      <View style={styles.animatedView}>
        <KeyboardAvoidingView
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 40}
        >
          <Text style={styles.textStyle}>
            Login
          </Text>
          
          <Text style={[styles.textStyle, { fontSize: Dimensions.get('window').height * .05 }]}>
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
            onSubmitEditing={() => {}} // Função realizada ao pressionar buttão 'Enter'
            returnKeyType='done'
            selectionColor='purple'
            textAlign='center'
            textContentType='emailAddress'
            style={styles.inputStyle}
          />

          <Text style={[styles.textStyle, { fontSize: Dimensions.get('window').height * .05, paddingTop: 30 }]}>
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
            returnKeyType='go'
            selectionColor='purple'
            textAlign='center'
            secureTextEntry
            textContentType='password'
            style={styles.inputStyle}
          />

        </KeyboardAvoidingView>
      </View>
  );
}

const LoginButton = () => {
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
      />
    </TouchableOpacity>
  );
}

export default function App() {
  let [fontsLoaded] = useFonts({
    'LakkiReddy-Regular': require('./assets/LakkiReddy-Regular.ttf'),
    'OpenSans-Bold': require('./assets/OpenSans-Bold.ttf'),
  });

  const [flag, setFlag] = useState(0);
  
  if (!fontsLoaded) {
    return <></>;
  }
  else {
    if (flag == 0) {
      setInterval(() => {
        setFlag(1);
      }, 7500);
      return LoadingScreen();
    }
    else if (flag == 1) {
      return (
        <View>
          {LoginForm()}
          {LoginButton()}
          <TouchableOpacity style={styles.createAccountTextContainer}>
            <Text style={styles.createAccountText}>
              Não possui uma conta? Clique aqui
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  createAccountTextContainer: {
    flex: 1, 
    position: 'absolute', 
    alignItems: 'center', 
    alignSelf: 'center', 
    alignContent: 'center', 
    marginTop: Dimensions.get('window').height * .8
  },
  createAccountText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').width * .04,
    textDecorationLine: 'underline'
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
    marginTop: Dimensions.get('window').height * .565,
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
    //paddingTop: 12,
    textAlignVertical: 'bottom',
    color: '#564c26',
  },
  textStyle: {
    fontFamily: 'LakkiReddy-Regular', 
    fontSize: 59, 
    textAlign: 'center', 
    color: '#fc9e21',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  animatedView: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('screen').height * 1.25,
    justifyContent: 'center', 
    //alignContent: 'center', 
    alignItems: 'center',
    //alignContent: 'center',
    backgroundColor: '#263056',
    paddingTop: Dimensions.get('window').height * .045
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
    paddingTop: Dimensions.get('window').height * .9,
    color: '#FFFFFF',
    position: 'absolute',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  }
});
