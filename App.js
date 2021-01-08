// Módulos do React Native
import React from 'react'
import { 
  StyleSheet, 
  Text, 
  View, 
  Dimensions
} from 'react-native'
import { Button } from 'react-native-elements';

// Módulos do Tensorflow.js
import * as tf from '@tensorflow/tfjs'
import { cameraWithTensors, detectGLCapabilities } from '@tensorflow/tfjs-react-native'
import * as handpose from '@tensorflow-models/handpose'
require('@tensorflow/tfjs-backend-webgl'); // Necessário?

// Módulos do Expo
import { Camera } from 'expo-camera';
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'

// Componente de alta ordem para usar as funções da câmera 
const TensorCamera = cameraWithTensors(Camera);

// Dimensões do aparelho
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

class App extends React.Component {
  
  state = {
    isTfReady: false,                   // Determina se o módulo do TensorFlow está carregado
    isModelReady: false,                // Determina se o modelo do @tensorflow-models/handpose está carregado     
    hasPermission: null,                // Determina se o usuário concedeu permissão ao acesso das cameras
    type: Camera.Constants.Type.front,  // Define o tipo de câmera padrão que será usada na aplicação
    showTensorCamera: false
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
    this.model = await handpose.load()
    this.setState({ isModelReady: true })

    // Solicita permissão do usuário para ter acesso às câmeras
    this.getPermissionAsync()
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    // Determina se o usuário garantiu permissão de acesso às câmeras ou não
    this.setState({ hasPermission: status === 'granted' });

  }

  handleCameraStream = (images, updatePreview, gl) => {

    console.log(detectGLCapabilities(gl));

    const loop = async () => {
      const nextImageTensor = await images.next().value;
      
      const predictions = await this.model.estimateHands(nextImageTensor);

      // Printa os valores estimados pelo modelo
      console.log(predictions) 
      
      /* 
      Funções utilizadas pelo Tensorflow para atualizar os frames da 
      câmera na tela do celular. O UpdatePreview atualiza o frame,
      enquanto que o gl.endFrameEXP procoessa o próximo frame.
      */
      updatePreview();
      gl.endFrameEXP();

      // Função que recebe o proóximo frame e retorna ao início do loop
      requestAnimationFrame(loop);
    };
    loop();
  }

  renderTensorCamera(textureDims, tensorDims) {
    return (
      <View>
          <Text style={styles.detectionText} >
            Estimating hands. Check log at the console.
          </Text>
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
        <View style={{ marginTop: SCREEN_HEIGHT * .5 }}>
          { 
            (isTfReady) ? 
            <Text style={styles.loaded}>TensorFlow module loaded</Text>
            :
            <Text style={styles.notLoaded}>Loading TensorFlow module...</Text>
          }

          { 
            (isModelReady) ? 
            <Text style={styles.loaded}>@mediapipe/handpose loaded</Text>
            :
            <Text style={styles.notLoaded}>Loading @mediapipe/handpose model...</Text>
          }

          { 
            (hasPermission) ? 
            <Text style={styles.loaded}>Permissions granted</Text>
            :
            <Text style={styles.notLoaded}>Waiting for permissions...</Text>
          }
          
        </View>
    );
  }

  render() {
    const textureDims = (Platform.OS === 'ios') ? { height: 1920, width: 1080} : { height: 1200, width: 1600 };
    const tensorDims = { width: 152, height: 200 };

    const { isTfReady, isModelReady, hasPermission } = this.state;

    if (hasPermission === true) {
      // Carrega o componente do TensorCamera e permite a visualização câmera
      return this.renderTensorCamera(textureDims, tensorDims);
    } 
    
    else {
      // Tela de carregamento inicial
      return this.loadingScreen(isTfReady, isModelReady, hasPermission);
    }
  }
}

const styles = StyleSheet.create({
  tfCameraView: {
    width: SCREEN_WIDTH * .75,
    height: SCREEN_HEIGHT * .5 ,
    zIndex: 1,
    borderWidth: 0,
    borderRadius: 0,
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center'
  },
  loaded: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'green'
  },
  notLoaded: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'red'
  },
  detectionText: { 
    textAlign: 'center', 
    textAlignVertical: 'center', 
    marginTop: SCREEN_HEIGHT * .20, 
    fontWeight: 'bold', 
    color: 'blue' 
  },
  fluffyDetected: {
    textAlign: 'center', 
    textAlignVertical: 'center', 
    fontWeight: 'bold', 
    color: 'blue' 
  }
})

export default App;