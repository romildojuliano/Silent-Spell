import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { Button } from 'react-native-elements';
import LottieView from 'lottie-react-native';
import firebase from 'firebase';

const explosionAnimation = () => <LottieView source={require('../../assets/9990-explosion.json')} autoPlay />
const splashAnimation = () => <LottieView source={require('../../assets/30718-water-splash-effect.json')} autoPlay />
const smokeAnimation = () => <LottieView source={require('../../assets/30714-puffy-smoke.json')} autoPlay />
const glassRainAnimation = () => <LottieView source={require('../../assets/30112-level-complete-confetti-effect.json')} autoPlay />
//const explosion2Animation = () => <LottieView source={require('../../assets/11786-explosion.json')} autoPlay />
const heartAnimation = () => <LottieView source={require('../../assets/67-exploding-heart.json')} autoPlay />
//const handsAnimation = () => <LottieView source={require('../../assets/26920-magic-hands-stars (1).json')} autoPlay />
//const curseAnimation = () => <LottieView source={require('../../assets/28213-bh-symbol.json')} autoPlay />
//const circleAnimation = () => <LottieView source={require('../../assets/30969-circle-burst.json')} autoPlay />
const burstAnimation = () => <LottieView source={require('../../assets/36708-burst-effect.json')} autoPlay />
//const splash2Animation = () => <LottieView source={require('../../assets/35675-splash.json')} autoPlay />
//const poisonAnimation = () => <LottieView source={require('../../assets/37451-splash-foam.json')} autoPlay />

const animationTimers = {
  explosion: 400,
  waterSplash: 1000,
  smoke: 1000,
  glassRain: 4000,
  // explosion2: 1000
  heart: 1250,
  // hands: 1000,
  // curse: 1000,
  // circle: 1000,
  burst: 1250,
  // splash2: 1000,
  // poison: 1000
}

const animationRef = () => {
  return (
    <TouchableOpacity style={styles.containerButton}>
      <Button 
          title='Animation' 
          titleStyle={styles.titleStyle}
          buttonStyle={styles.ButtonStd}
          onPress={() => {
            setAnimation(true);
            setTimeout(() => {
              setAnimation(false);
            }, animationTimers.burst);
          }}
      />
      {animationFlag ? burstAnimation() : null}
    </TouchableOpacity>
  );
}

const MainScreen = ({ navigation }) => {
  const [animationFlag, setAnimation] = useState(false);

  return (
    <View style={styles.absoluteBackground}>
      
      <TouchableOpacity style={styles.containerButton}>
        <Button 
            title='INICIAR ' 
            titleStyle={styles.titleStyle}
            buttonStyle={styles.ButtonStd}
            icon={
              <Ionicons name='ios-game-controller' size={Dimensions.get('window').height * .03} color='white'/>
            }
            iconRight
            onPress={() => {
              navigation.navigate('TrackHands')
            }}
        />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.containerButton}>
        <Button 
          title='CONFIGURAÇÕES ' 
          icon={
              <Ionicons name='ios-settings' size={Dimensions.get('window').height * .03} color='white'/>
            }
          iconRight
          onPress={() => navigation.navigate('Config')}
          titleStyle={styles.titleStyle}
          buttonStyle={styles.ButtonStd}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.containerButton}>
        <Button 
          title='SAIR DO JOGO ' 
          titleStyle={styles.titleStyle}
          buttonStyle={styles.ButtonStd}
          icon={
            <Ionicons name='ios-exit' size={Dimensions.get('window').height * .03} color='white'/>
          }
          iconRight
          onPress={() => {
            firebase.auth().signOut();
            navigation.navigate('Auth');
          }} 
        />
      </TouchableOpacity>


    </View>
  );
}

const styles = StyleSheet.create({
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
  absoluteBackground: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height * 1.25,
    backgroundColor: '#263056',
    alignItems: 'center',
    paddingTop: Dimensions.get('screen').height * .225
  },
  containerButton: { 
    marginTop: Dimensions.get('window').height * .05,
  },
  titleStyle: {
    fontFamily: 'OpenSans-Bold', 
    fontWeight: 'bold', 
    //textShadowColor: 'rgba(0, 0, 0, 1)',
    //textShadowOffset: { width: 0, height: 1 },
    //textShadowRadius: 1,
    fontSize: Dimensions.get('window').fontScale * 18.5
  }
});

export default MainScreen;