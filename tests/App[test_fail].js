// Módulos do React Native
import React from 'react'
import { 
  StyleSheet, 
  Image,
  Text, 
  View, 
  Dimensions,
  SafeAreaView
} from 'react-native'
import { Button } from 'react-native-elements';

// Módulos do Tensorflow.js
import * as tf from '@tensorflow/tfjs'
import { decodeJpeg, cameraWithTensors, fetch } from '@tensorflow/tfjs-react-native'
import * as handpose from '@tensorflow-models/handpose'
require('@tensorflow/tfjs-backend-webgl'); 

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
    showTensorCamera: false,            // Parâmetro para mostrar ou não 
    nextImageTensor: null,
    predictions: null,
    imageTensor: null
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

  onChange = e => {
    let files = e.target.files;
    console.log(files);
    let reader = new FileReader();
    reader.onload = r => {
         console.log(r.target.result);
     };
    reader.readAsDataURL(files[0]);
  }

  imageToTensor(rawImageData) {
    const TO_UINT8ARRAY = true
    const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY)
    // Drop the alpha channel info for mobilenet
    const buffer = new Uint8Array(width * height * 3)
    let offset = 0 // offset into original data
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset]
      buffer[i + 1] = data[offset + 1]
      buffer[i + 2] = data[offset + 2]

      offset += 4
    }

    return tf.tensor3d(buffer, [height, width, 3])
  }

  async componentDidMount() {
    // Altera o estado para indicar que o módulo do TensorFlow está carregado
    await tf.ready()
    this.setState({ isTfReady: true })

    // Altera o estado para indicar que o modelo do Handpose está carregado 
    this.model = await handpose.load();
    this.setState({ isModelReady: true })

    // Solicita permissão do usuário para ter acesso às câmeras
    this.getPermissionAsync()
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    //this.modelUrl = 'https://tfhub.dev/mediapipe/tfjs-model/handskeleton/1/default/1';
    //this.tfHubModel = await tf.loadGraphModel(this.modelUrl, { fromTFHub: true });
    const imageAssetPath = Image.resolveAssetSource(require('./assets/maofofa.jpg'));
    const response = await fetch(imageAssetPath.uri, {}, { isBinary: true });
    const imageDataArrayBuffer = await response.arrayBuffer();
    const imageData = new Uint8Array(imageDataArrayBuffer);  
    this.imageTensor = decodeJpeg(imageData);

    console.log('Imagem decodificada com sucesso!');
    // Determina se o usuário garantiu permissão de acesso às câmeras ou não
    this.setState({ hasPermission: status === 'granted' });

  }

   handleCameraStream = async (images, updatePreview, gl) => {
    const loop = async () => {

      //this.setState({ nextImageTensor: await images.next().value });
      //Printa os valores estimados pelo modelo
      const predictions = this.model.estimateHands(this.imageTensor);
      console.log(predictions);
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
      <SafeAreaView>
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
            onReady={this.handleCameraStream.bind(this)}
            autorender={true}
          />
        </SafeAreaView>
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

  handleImage() {
    try {

    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const textureDims = (Platform.OS === 'ios') ? { height: 1920, width: 1080} : { height: 1200, width: 1600 };
    const tensorDims = { width: 256, height: 256 };

    const { isTfReady, isModelReady, hasPermission, showTensorCamera } = this.state;

    if (hasPermission === true) {
      if (showTensorCamera) {
        //Carrega o componente do TensorCamera e permite a visualização câmera se showTensor === true
        return (
          <View>
            <Button 
              title='Stop tracking'
              style='outline'
              onPress={() => this.setState({ showTensorCamera: false })}
              buttonStyle={styles.buttonStyle}
            />
            {this.renderTensorCamera(textureDims, tensorDims)}
          </View>
        )
      }
      else {
        // Desativa a TensorCamera até que o botão seja pressionado; inicia nesse estado por padrão
        return (
          <Button 
            title='Start tracking'
            style='outline'
            onPress={() => this.setState({ showTensorCamera: true })}
            buttonStyle={styles.buttonStyle}
          />
        );
      }      
    } 
    
    else if (hasPermission === null) {
      // Tela de carregamento inicial
      return this.loadingScreen(isTfReady, isModelReady, hasPermission);
    }

    else {
      return (
        <View style={styles.notLoaded}>
          <Text>
            Você não possui permitiu o acesso à câmera.
          </Text>
        </View>
      );
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
    fontWeight: 'bold', 
    color: 'blue' 
  },
  fluffyDetected: {
    textAlign: 'center', 
    textAlignVertical: 'center', 
    fontWeight: 'bold', 
    color: 'blue' 
  },
  buttonStyle: {
    width: SCREEN_WIDTH * .5,
    height: SCREEN_HEIGHT * .05,
    marginTop: SCREEN_HEIGHT * .25, 
    alignSelf: 'center'
  }
})

export default App;