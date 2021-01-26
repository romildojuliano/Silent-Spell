import React from 'react';
import {View, Text, StyleSheet, Image, Dimensions, Button} from 'react-native';
import { useFonts } from 'expo-font';


const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const Suggestion = ({buffedLetter, debuffedLetter, update}) =>{
    let [fontsLoaded] = useFonts({
        'LakkiReddy-Regular': require('../../assets/LakkiReddy-Regular.ttf'),
        'OpenSans-Bold': require('../../assets/OpenSans-Bold.ttf'),
      });
    return(
        <View style={styles.Background}>
            <View>
                <View style={styles.Wrapper}>
                    <Image source={require('../../assets/anjo.png')} style={styles.Anjo}/>
                    <Text style={styles.Text}>Nessa rodada você deve preferir magias com {buffedLetter}</Text>
                </View>
                <View style={styles.Wrapper}>
                    <Text style={styles.Text}>Nessa rodada você deve evitar magias com {debuffedLetter}</Text>
                    <Image source={require('../../assets/mal.png')} style={styles.Demonio}/>
                </View>
                <Button onPress={()=>{update()}} title='close'/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    Wrapper:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-around'
    },
    Background:{
        flexDirection:'column',
        justifyContent:'space-around',
        backgroundColor: '#263056',
        width:SCREEN_WIDTH,
        height:SCREEN_HEIGHT*0.7
    },
    Anjo:{
        width: SCREEN_WIDTH*0.4,
        height:SCREEN_HEIGHT*0.3,
        resizeMode: 'contain',
        alignSelf:'flex-start'
    },
    Demonio:{
        width: SCREEN_WIDTH*0.4,
        height:SCREEN_HEIGHT*0.3,
        resizeMode: 'contain',
        alignSelf:'flex-end'
    },
    Text:{
        fontFamily: 'LakkiReddy-Regular', 
        fontSize:SCREEN_HEIGHT*0.03,
        textAlign: 'center', 
        color: '#fc9e21',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 5,
        width:SCREEN_WIDTH*0.4
    },
});

export default Suggestion;