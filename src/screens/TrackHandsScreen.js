// Módulos do React Native
import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

// Módulos do Tensorflow.js
import * as tf from '@tensorflow/tfjs';
import {
  cameraWithTensors,
  detectGLCapabilities,
} from '@tensorflow/tfjs-react-native';
import * as handpose from '@tensorflow-models/handpose';

require('@tensorflow/tfjs-backend-webgl'); // Necessário?

// Módulos do Expo
import { Camera } from 'expo-camera';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

import { w3cwebsocket as W3CWebSocket } from 'websocket';

import CheckUp from '../components/CheckUp';
import Drop from './Drop';

//configurações do websocket
const URL = 'ws://192.168.0.115:3000';
const client = new W3CWebSocket(URL);

// Componente de alta ordem para usar as funções da câmera
const TensorCamera = cameraWithTensors(Camera);

// Dimensões do aparelho
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

class TrackHandsScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    isTfReady: false, // Determina se o módulo do TensorFlow está carregado
    isModelReady: false, // Determina se o modelo do @tensorflow-models/handpose está carregado
    hasPermission: null, // Determina se o usuário concedeu permissão ao acesso das cameras
    type: Camera.Constants.Type.front, // Define o tipo de câmera padrão que será usada na aplicação
    frameCounter: 0,
    as: [],
    bs: [],
    cs: [],
    ds: [],
    es: [],
    is: [],
    ls: [],
    us: [],
    ws: [],
    drops: [],
  };

  /*
  Solicita o acesso à câmera de forma assícrona;
  Caso não seja garantido, o app não irá funcionar;
  */
  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  async componentDidMount() {
    // Altera o estado para indicar que o módulo do TensorFlow está carregado
    await tf.ready();
    this.setState({ isTfReady: true });

    // Altera o estado para indicar que o modelo do Handpose está carregado
    this.model = await handpose.load({
      maxContinuousChecks: 2,
      detectionConfidence: 0.3,
      iouThreshold: 0.3,
      scoreThreshold: 0.75,
    });
    this.setState({ isModelReady: true });

    // Solicita permissão do usuário para ter acesso às câmeras
    this.getPermissionAsync();
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    // Determina se o usuário garantiu permissão de acesso às câmeras ou não
    this.setState({ hasPermission: status === 'granted' });

    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };

    client.onmessage = (message) => {
      const dataFromServer = message.data;
      console.log('Mensagem: ', dataFromServer);
      if (dataFromServer == 'A') {
        this.setState({ as: [] });
      } else if (dataFromServer == 'B') {
        this.setState({ bs: [] });
      } else if (dataFromServer == 'C') {
        this.setState({ cs: [] });
      } else if (dataFromServer == 'D') {
        this.setState({ ds: [] });
      } else if (dataFromServer == 'E') {
        this.setState({ es: [] });
      } else if (dataFromServer == 'I') {
        this.setState({ is: [] });
      } else if (dataFromServer == 'L') {
        this.setState({ ls: [] });
      } else if (dataFromServer == 'U') {
        this.setState({ us: [] });
      } else if (dataFromServer == 'W') {
        this.setState({ ws: [] });
      }
    };
  }

  processingDrop = () => {
    var drops = [];
    var vectorAs = [];
    var vectorBs = [];
    var vectorCs = [];
    var vectorDs = [];
    var vectorEs = [];
    var vectorIs = [];
    var vectorUs = [];
    var vectorWs = [];
    var vectorLs = [];
    for (var a of this.state.as) {
      vectorAs.push([a[0], a[1] + 1]);
      drops.push(<Drop position={[a[0], a[1] + 5]} text={'A'} />);
    }
    for (var b of this.state.bs) {
      vectorBs.push([b[0], b[1] + 5]);
      drops.push(<Drop position={[b[0], b[1] + 5]} text={'B'} />);
    }
    for (var c of this.state.cs) {
      vectorCs.push([c[0], c[1] + 5]);
      drops.push(<Drop position={[c[0], c[1] + 5]} text={'C'} />);
    }
    for (var d of this.state.ds) {
      vectorDs.push([d[0], d[1] + 5]);
      drops.push(<Drop position={[d[0], d[1] + 5]} text={'D'} />);
    }
    for (var e of this.state.es) {
      vectorEs.push([e[0], e[1] + 5]);
      drops.push(<Drop position={[e[0], e[1] + 5]} text={'E'} />);
    }
    for (var i of this.state.is) {
      vectorIs.push([i[0], i[1] + 5]);
      drops.push(<Drop position={[i[0], i[1] + 5]} text={'I'} />);
    }
    for (var l of this.state.ls) {
      vectorLs.push([l[0], l[1] + 5]);
      drops.push(<Drop position={[l[0], l[1] + 5]} text={'L'} />);
    }
    for (var u of this.state.us) {
      vectorUs.push([u[0], u[1] + 5]);
      drops.push(<Drop position={[u[0], u[1] + 5]} text={'U'} />);
    }
    for (var w of this.state.ws) {
      vectorWs.push([w[0], w[1] + 5]);
      drops.push(<Drop position={[w[0], w[1] + 5]} text={'W'} />);
    }

    //console.log(vectorAs)
    //console.log(SCREEN_HEIGHT, SCREEN_WIDTH)
    const choosen = Math.floor(Math.random() * 9 - 1);
    switch (choosen) {
      case 0:
        vectorAs.push([30 + Math.random() * (SCREEN_WIDTH - 30), 0]);
        break;
      case 1:
        vectorBs.push([30 + Math.random() * (SCREEN_WIDTH - 30), 0]);
        break;
      case 2:
        vectorCs.push([30 + Math.random() * (SCREEN_WIDTH - 30), 0]);
        break;
      case 3:
        vectorDs.push([30 + Math.random() * (SCREEN_WIDTH - 30), 0]);
        break;
      case 4:
        vectorEs.push([30 + Math.random() * (SCREEN_WIDTH - 30), 0]);
        break;
      case 5:
        vectorIs.push([30 + Math.random() * (SCREEN_WIDTH - 30), 0]);
        break;
      case 6:
        vectorLs.push([30 + Math.random() * (SCREEN_WIDTH - 30), 0]);
        break;
      case 7:
        vectorUs.push([30 + Math.random() * (SCREEN_WIDTH - 30), 0]);
        break;
      case 8:
        vectorWs.push([30 + Math.random() * (SCREEN_WIDTH - 30), 0]);
        break;
    }
    this.setState({
      as: vectorAs,
      bs: vectorBs,
      cs: vectorCs,
      ds: vectorDs,
      es: vectorEs,
      is: vectorIs,
      ls: vectorLs,
      us: vectorUs,
      ws: vectorWs,
      drops: drops,
    });
  };

  handleCameraStream = (images, updatePreview, gl) => {
    console.log(detectGLCapabilities(gl));

    const loop = async () => {
      const nextImageTensor = await images.next().value;

      if (this.state.frameCounter % 10 == 0) {
        //console.log(nextImageTensor)
        const predictions = await this.model.estimateHands(nextImageTensor);
        client.send(JSON.stringify(predictions, 2));
        //client.send(JSON.stringify(nextImageTensor,2));
        this.processingDrop();
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
  };

  renderTensorCamera(textureDims, tensorDims) {
    return (
      <View>
        <Text style={styles.detectionText}>
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
    );
  }

  loadingScreen(isTfReady, isModelReady, hasPermission) {
    return (
      <CheckUp
        isTfReady={isTfReady}
        isModelReady={isModelReady}
        hasPermission={hasPermission}
      />
    );
  }

  render() {
    const textureDims =
      Platform.OS === 'ios'
        ? { height: 1920, width: 1080 }
        : { height: 1200, width: 1600 };
    const tensorDims = { width: 200, height: 200 };

    const {
      isTfReady,
      isModelReady,
      hasPermission,
      as,
      bs,
      cs,
      ds,
      es,
      is,
      ls,
      us,
      ws,
    } = this.state;

    if (hasPermission === true) {
      //Carrega o componente do TensorCamera e permite a visualização câmera se showTensor === true
      return (
        <View>
          {this.renderTensorCamera(textureDims, tensorDims)}
          {this.state.drops}
          <Text>{as.length}</Text>
          <Text>{bs.length}</Text>
          <Text>{cs.length}</Text>
          <Text>{ds.length}</Text>
          <Text>{es.length}</Text>
          <Text>{is.length}</Text>
          <Text>{ls.length}</Text>
          <Text>{us.length}</Text>
          <Text>{ws.length}</Text>
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
    width: SCREEN_WIDTH * 0.75,
    height: SCREEN_HEIGHT * 0.5,
    zIndex: 1,
    borderWidth: 0,
    borderRadius: 0,
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  detectionText: {
    marginTop: SCREEN_HEIGHT * 0.25,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: 'bold',
    color: 'blue',
  },
});

export default TrackHandsScreen;
