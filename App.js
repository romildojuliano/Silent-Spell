// Módulos do React Native
import React from 'react'
import { 
  StyleSheet, 
  Text, 
  View, 
  Dimensions,
  StatusBar, 
  ActivityIndicator, 
  TouchableOpacity, 
  Image 
} from 'react-native'

// Módulos do Tensorflow.js
import * as tf from '@tensorflow/tfjs'
import { fetch, cameraWithTensors } from '@tensorflow/tfjs-react-native'
import * as handpose from '@tensorflow-models/handpose'
// import * as mobilenet from '@tensorflow-models/mobilenet'


// Módulos do Expo
import { Camera } from 'expo-camera';
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'

// Outros módulos
import * as jpeg from 'jpeg-js'

const TensorCamera = cameraWithTensors(Camera);
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

class App extends React.Component {
  
  state = {
    isTfReady: false,
    isModelReady: false,
    predictions: null,
    image: null,
    hasPermission: null,
    type: Camera.Constants.Type.front,
    fluffyHands: false
  }

  selectImage = async () => {
    try {
      let response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3]
      })
  
      if (!response.cancelled) {
        const source = { uri: response.uri }
        this.setState({ image: source })
        this.classifyImage()
      }
    } catch (error) {
      console.log(error)
    }
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

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY)
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!')
      }
    }
  }

  classifyImage = async () => {
    try {
      //const imageAssetPath = Image.resolveAssetSource(this.state.image)
      //const response = await fetch(imageAssetPath.uri, {}, { isBinary: true })
      const response = await fetch('https://upload.wikimedia.org/wikipedia/commons/3/32/Human-Hands-Front-Back.jpg', {}, { isBinary: true })
      //console.log(response)
      const rawImageData = await response.arrayBuffer()
      const imageTensor = this.imageToTensor(rawImageData)
      const predictions = await this.model.estimateHands(imageTensor)
      this.setState({ predictions })

      console.log(predictions)
      console.log('foi a predicao')
    } catch (error) {
      console.log(error)
    }
  }

  async componentDidMount() {
    await tf.ready()
    this.setState({
      isTfReady: true
    })
    this.model = await handpose.load()
    this.setState({ isModelReady: true })

    //Output in Expo console
    console.log(this.state.isTfReady)
    this.getPermissionAsync()
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasPermission: status === 'granted' });
  }

  handleCameraStream = (imageAsTensors) => {
    console.log("chegou aqui?")
    const loop = async () => {
      //console.log("opa?")
      const nextImageTensor = await imageAsTensors.next().value;
      //console.log("nexImage")
      //await getPrediction(nextImageTensor);
      const predictions = await this.model.estimateHands(nextImageTensor)
      console.log(predictions) // Printa os valores estimados pelo modelo
      //console.log("prediction")
      requestAnimationFrameId = requestAnimationFrame(loop);
    };
    loop();
  }

  handposeHandler = async () => {
    const loop = async () => {
      const model = await handpose.load();
      const predictions = await model.estimateHands(document.querySelector('video'));
      console.log(predictions);
    }
    loop();
  }

  render() {
    let textureDims;
    if (Platform.OS === 'ios') {
      textureDims = {
        height: 1920,
        width: 1080,
      };
    } else {
      textureDims = {
        height: 1200,
        width: 1600,
      };
    }
    const tensorDims = { width: 152, height: 200 };

    const { isTfReady, isModelReady, predictions, image, hasPermission } = this.state

    if (hasPermission === true) {
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
            autorender={true}
          />
        </View>
    );
    } else {
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
            (Permissions) ? 
            <Text style={styles.loaded}>Permissions granted</Text>
            :
            <Text style={styles.notLoaded}>Waiting for permissions...</Text>
          }
          
        </View>
      )
    }
    
  }


}

const styles = StyleSheet.create({
  tfCameraView: {
    width: 700/2,
    height: 800/2,
    zIndex: 1,
    borderWidth: 0,
    borderRadius: 0,
    //marginTop: SCREEN_HEIGHT * .25,
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

export default App