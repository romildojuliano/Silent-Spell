import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
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

const MainScreen = ({ navigation }) => {
  const [animationFlag, setAnimation] = useState(false);

  return (
    <View>
      <Text style={{ paddingTop: 50, textAlign: 'center', fontSize: 30 }}> 
        Main Screen
      </Text>
      <TouchableOpacity>
        <Button 
          title='Logout' 
          buttonStyle={styles.logOutButton}
          onPress={() => {
            firebase.auth().signOut();
            navigation.navigate('Auth');
          }} 
        />
      </TouchableOpacity>
      
      <TouchableOpacity>
        <Button 
            title='Animation' 
            buttonStyle={styles.logOutButton}
            onPress={() => {
              setAnimation(true);
              setTimeout(() => {
                setAnimation(false);
              }, animationTimers.burst);
            }}
        />
        {animationFlag ? burstAnimation() : null}
      </TouchableOpacity>
      <Button 
            title='go to TrackHands' 
            buttonStyle={styles.logOutButton}
            onPress={() => {
              navigation.navigate('TrackHands')
            }}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  logOutButton: { 
    width: 200, 
    height: 50, 
    alignSelf: 'center', 
    marginTop: 30 
  }
});

export default MainScreen;