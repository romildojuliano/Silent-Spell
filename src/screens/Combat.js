import React, {useState} from 'react';
import {Text, Image, View, StyleSheet, Dimensions} from 'react-native';
import { useFonts } from 'expo-font';
import * as Progress from 'react-native-progress';


const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;


const Combat = ({navigation}) => {
    let [fontsLoaded] = useFonts({
        'LakkiReddy-Regular': require('../../assets/LakkiReddy-Regular.ttf'),
        'OpenSans-Bold': require('../../assets/OpenSans-Bold.ttf'),
      });
    if (!fontsLoaded) {
        console.log('couldn\'t find the fonts')
    }
    const [hp, setHp] = useState(0.5)
    const [enemyHp, setEnemyHp] = useState(0.2)
    const [confidence, setConfidence] = useState(0.5)
    const bar = (amount) => {
        const color = `rgb(180,${Math.floor(amount*255)},0)`
        return (<View style={{width:'85%',flexDirection:'row'}}>
                    <View style={{width:"100%", flex:1}}>
                        <Progress.Bar progress={amount} width={null} borderRadius={0} borderWidth={0} unfilledColor="gray" color={color} height={SCREEN_HEIGHT*0.04} animated style={{ width: "100%" }}/>
                        <View style={{position: "absolute", width: "100%", height:"100%", alignItems: "center", justifyContent: "center"}}>
                            <Text style={{fontSize:SCREEN_HEIGHT*0.03}}>
                                {amount * 100} 
                            </Text>
                        </View>
                    </View>
                </View>);
    }

    const drawCharacter = (confidence,string) =>{
        
        return (
            <Text style={
                {fontSize:SCREEN_HEIGHT*0.07,
                justifyContent:'center',
                color:`rgba(255,215,0,${confidence})`}
                }>
                    {string}
            </Text>
        );
    }

    return(
        <View style={styles.Background}>
            <View style={styles.Player}>
                <View>
                    {bar(hp)}
                    <Image source={require('./../../assets/wizard.jpg')} style={styles.Enemy}/>
                </View>
            </View>
            
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-around', alignSelf:'stretch'}}>
                <View style={{ alignItems:'center'}}>
                    <Text style={styles.Text}>PALAVRA FORMADA:</Text>
                    {drawCharacter(1.0,'ABC')}
                </View>

                <View style={{ alignItems:'center',}}>
                    <Text style={styles.Text}>LETRA DETECTADA:</Text>
                    {drawCharacter(confidence,'A')}
                </View>

            </View>
            <View style={styles.Player}>
                <View>
                    {bar(enemyHp)}
                    <Image source={require('./../../assets/wizard.jpg')} style={styles.Ally}/>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    Player:{
        flex:1,
        alignItems:'center',
        justifyContent:'space-around'
    },
    Background:{
        paddingTop:SCREEN_HEIGHT*0.04,
        flexDirection:'column',
        flex:1,
        justifyContent:'space-around',
        alignItems:'center',
        backgroundColor: '#263056',
    },
    Text:{
        fontFamily: 'LakkiReddy-Regular', 
        fontSize:SCREEN_HEIGHT*0.02,
        textAlign: 'center', 
        color: '#fc9e21',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 5
    },
    Enemy:{
        width: SCREEN_WIDTH*0.75,
        height:SCREEN_HEIGHT*0.3,
        resizeMode: 'contain',
    },
    Ally:{
        width: SCREEN_WIDTH*0.75,
        height:SCREEN_HEIGHT*0.3,
        resizeMode: 'contain'
    },
});

export default Combat;