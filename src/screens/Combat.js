// Módulos do React Native
import React from 'react'
import { 
  StyleSheet, 
  Text, 
  View, 
  Dimensions,
  Image
} from 'react-native'

// Módulos do Tensorflow.js
import * as tf from '@tensorflow/tfjs'
import { cameraWithTensors, detectGLCapabilities } from '@tensorflow/tfjs-react-native'
import * as handpose from '@tensorflow-models/handpose'

require('@tensorflow/tfjs-backend-webgl'); // Necessário?

// Módulos do Expo
import { Camera } from 'expo-camera';
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'
import * as Progress from 'react-native-progress';

import { w3cwebsocket as W3CWebSocket } from 'websocket';

import CheckUp from '../components/CheckUp'

//configurações do websocket
const URL = 'ws://192.168.0.108:3000';
const client = new W3CWebSocket(URL);

// Componente de alta ordem para usar as funções da câmera 
const TensorCamera = cameraWithTensors(Camera);

// Dimensões do aparelho
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

class Combat extends React.Component {
  
  state = {
    isTfReady: false,                   // Determina se o módulo do TensorFlow está carregado
    isModelReady: false,                // Determina se o modelo do @tensorflow-models/handpose está carregado     
    hasPermission: null,                // Determina se o usuário concedeu permissão ao acesso das cameras
    type: Camera.Constants.Type.front,  // Define o tipo de câmera padrão que será usada na aplicação
    frameCounter: 0,
    hp: 1.0,
    enemyHp: 1.0,
    confidence:0.4
  }

  /*
  Solicita o acesso à câmera de forma assícrona;
  Caso não seja garantido, o app não irá funcionar;
  */
  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY)
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!')
      }
    }
  }

  async componentDidMount() {
    // Altera o estado para indicar que o módulo do TensorFlow está carregado
    await tf.ready()
    this.setState({ isTfReady: true })

    // Altera o estado para indicar que o modelo do Handpose está carregado 
    this.model = await handpose.load({maxContinuousChecks: 2,
                                      detectionConfidence:0.3,
                                      iouThreshold: 0.3,
                                    scoreThreshold:0.75})
    this.setState({ isModelReady: true })

    // Solicita permissão do usuário para ter acesso às câmeras
    this.getPermissionAsync()
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    // Determina se o usuário garantiu permissão de acesso às câmeras ou não
    this.setState({ hasPermission: status === 'granted' });


    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };

    client.onmessage = (message) => {
      const dataFromServer = message.data;
      console.log('Mensagem: ', dataFromServer);
    };

    let [fontsLoaded] = useFonts({
      'LakkiReddy-Regular': require('../../assets/LakkiReddy-Regular.ttf'),
      'OpenSans-Bold': require('../../assets/OpenSans-Bold.ttf'),
    });
    if (!fontsLoaded) {
        console.log('couldn\'t find the fonts')
    }
    

  }
  bar = (amount) => {
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

  drawCharacter = (confidence,string) =>{
      
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
  handleCameraStream = (images, updatePreview, gl) => {
    console.log(detectGLCapabilities(gl));
     
    const loop = async () => {
    
      const nextImageTensor = await images.next().value;
      
      if (this.state.frameCounter % 10 == 0) { 
        //console.log(nextImageTensor)
        const predictions = await this.model.estimateHands(nextImageTensor);
        client.send(JSON.stringify(predictions,2));
        //client.send(JSON.stringify(nextImageTensor,2));
      }
      
      
      /* 
      Funções utilizadas pelo Tensorflow para atualizar os frames da 
      câmera na tela do celular. O UpdatePreview atualiza o frame,
      enquanto que o gl.endFrameEXP procoessa o próximo frame.
      */
      updatePreview();
      gl.endFrameEXP();

      this.setState({ frameCounter: this.state.frameCounter + 1 });

      // Função que recebe o proóximo frame e retorna ao início do loop
      requestAnimationFrame(loop);
    };
    loop();
  }

  renderTensorCamera(textureDims, tensorDims) {
    return (
      <View>
          
          <TensorCamera
            // Standard Camera props
            style={styles.tfCameraView}
            type={this.state.type}
            // Tensor related props
            cameraTextureHeight={textureDims.height}
            cameraTextureWidth={textureDims.width}
            resizeHeight={tensorDims.height}
            resizeWidth={tensorDims.width}
            resizeDepth={3}
            onReady={this.handleCameraStream}
            autorender={false}
          />
        </View>
    )
  }

  loadingScreen(isTfReady, isModelReady, hasPermission) {
    return (
        <CheckUp isTfReady={isTfReady} isModelReady={isModelReady} hasPermission={hasPermission}/>
    );
  }

  render() {
    const textureDims = (Platform.OS === 'ios') ? { height: 1920, width: 1080} : { height: 1200, width: 1600 };
    const tensorDims = { width: 200, height: 200 };

    const { isTfReady, isModelReady, hasPermission } = this.state;

    if (hasPermission === true) {
      
        //Carrega o componente do TensorCamera e permite a visualização câmera se showTensor === true
        return (
          
            <View style={styles.Background}>
                <View style={styles.Player}>
                    <View>
                        {this.bar(this.state.enemyHp)}
                        <Image source={require('./../../assets/wizard.jpg')} style={styles.Enemy}/>
                    </View>
                </View>
                
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-around', alignSelf:'stretch'}}>
                    <View style={{ alignItems:'center'}}>
                        <Text style={styles.Text}>PALAVRA FORMADA:</Text>
                        {this.drawCharacter(1.0,'ABC')}
                    </View>
    
                    <View style={{ alignItems:'center',}}>
                        <Text style={styles.Text}>LETRA DETECTADA:</Text>
                        {this.drawCharacter(this.state.confidence,'A')}
                    </View>
    
                </View>
                <View style={styles.Player}>
                    <View>
                        {this.bar(this.state.hp)}
                        {this.renderTensorCamera(textureDims, tensorDims)}
                    </View>
                </View>
            </View>
        );
      
           
    } else {
      // Tela de carregamento inicial
      return this.loadingScreen(isTfReady, isModelReady, hasPermission);
    }
  }
}

const styles = StyleSheet.create({
  tfCameraView: {
    width: SCREEN_WIDTH * .75,
    height: SCREEN_HEIGHT * .4 ,
    zIndex: 1,
    borderWidth: 0,
    borderRadius: 0,
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center'
  },
  detectionText: { 
    marginTop: SCREEN_HEIGHT * .25,
    textAlign: 'center', 
    textAlignVertical: 'center', 
    fontWeight: 'bold', 
    color: 'blue' 
  },
  Player:{
    flex:1,
    alignItems:'center',
    justifyContent:'space-around'
  },
  Background:{
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
})

export default Combat;