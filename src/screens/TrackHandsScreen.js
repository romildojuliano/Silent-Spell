// Módulos do React Native
import React from 'react';
import { StyleSheet, Text, View, Dimensions, ImageBackground, Modal, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import LottieView from 'lottie-react-native'

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
const URL = 'ws://192.168.0.118:3000';
const client = new W3CWebSocket(URL);

// Componente de alta ordem para usar as funções da câmera
const TensorCamera = cameraWithTensors(Camera);

// Dimensões do aparelho
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

class TrackHandsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      hp: 5,
      gameOverFlag: false,
      dropsPontuation: 0
    };
  }

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
        this.setState({ dropsPontuation: this.state.dropsPontuation + this.state.as.length })
        this.setState({ as: [] });
      } else if (dataFromServer == 'B') {
        this.setState({ dropsPontuation: this.state.dropsPontuation + this.state.bs.length })
        this.setState({ bs: [] });
      } else if (dataFromServer == 'C') {
        this.setState({ dropsPontuation: this.state.dropsPontuation + this.state.cs.length })
        this.setState({ cs: [] });
      } else if (dataFromServer == 'D') {
        this.setState({ dropsPontuation: this.state.dropsPontuation + this.state.ds.length })
        this.setState({ ds: [] });
      } else if (dataFromServer == 'E') {
        this.setState({ dropsPontuation: this.state.dropsPontuation + this.state.es.length })
        this.setState({ es: [] });
      } else if (dataFromServer == 'I') {
        this.setState({ dropsPontuation: this.state.dropsPontuation + this.state.is.length })
        this.setState({ is: [] });
      } else if (dataFromServer == 'L') {
        this.setState({ dropsPontuation: this.state.dropsPontuation + this.state.ls.length })
        this.setState({ ls: [] });
      } else if (dataFromServer == 'U') {
        this.setState({ dropsPontuation: this.state.dropsPontuation + this.state.us.length })
        this.setState({ us: [] });
      } else if (dataFromServer == 'W') {
        this.setState({ dropsPontuation: this.state.dropsPontuation + this.state.ws.length })
        this.setState({ ws: [] });
      }
    };
  }

  damageCondition = (letra) => {
    console.log(letra);
    if (letra.length > 0) {
      if (letra[0][1] > SCREEN_HEIGHT) {
        letra.splice(0, 1);
        this.setState({
          hp: this.state.hp - 1,
        });
        if (this.state.hp == 0) {
          return true;
        }
      }
    }
    // return letra;
  };

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
    const choosen = Math.floor(Math.random() * 10 - 1);
    const RATE_FACTOR_LEFT = Dimensions.get('window').width * .0425;
    const RATE_FACTOR = Dimensions.get('window').width * .225;
    switch (choosen) {
      case 0:
        vectorAs.push([RATE_FACTOR_LEFT + Math.random() * (SCREEN_WIDTH - RATE_FACTOR), 0]);
        break;
      case 1:
        vectorBs.push([RATE_FACTOR_LEFT + Math.random() * (SCREEN_WIDTH - RATE_FACTOR), 0]);
        break;
      case 2:
        vectorCs.push([RATE_FACTOR_LEFT + Math.random() * (SCREEN_WIDTH - RATE_FACTOR), 0]);
        break;
      case 3:
        vectorDs.push([RATE_FACTOR_LEFT + Math.random() * (SCREEN_WIDTH - RATE_FACTOR), 0]);
        break;
      case 4:
        vectorEs.push([RATE_FACTOR_LEFT + Math.random() * (SCREEN_WIDTH - RATE_FACTOR), 0]);
        break;
      case 5:
        vectorIs.push([RATE_FACTOR_LEFT + Math.random() * (SCREEN_WIDTH - RATE_FACTOR), 0]);
        break;
      case 6:
        vectorLs.push([RATE_FACTOR_LEFT + Math.random() * (SCREEN_WIDTH - RATE_FACTOR), 0]);
        break;
      case 7:
        vectorUs.push([RATE_FACTOR_LEFT + Math.random() * (SCREEN_WIDTH - RATE_FACTOR), 0]);
        break;
      case 8:
        vectorWs.push([RATE_FACTOR_LEFT + Math.random() * (SCREEN_WIDTH - RATE_FACTOR), 0]);
        break;
    }

    // this.damageCondition(vectorAs);
    // this.damageCondition(vectorBs);
    // this.damageCondition(vectorCs);
    // this.damageCondition(vectorDs);
    // this.damageCondition(vectorEs);
    // this.damageCondition(vectorIs);
    // this.damageCondition(vectorLs);
    // this.damageCondition(vectorUs);
    // this.damageCondition(vectorWs);

    if (
      this.damageCondition(vectorAs) ||
      this.damageCondition(vectorBs) ||
      this.damageCondition(vectorCs) ||
      this.damageCondition(vectorDs) ||
      this.damageCondition(vectorEs) ||
      this.damageCondition(vectorIs) ||
      this.damageCondition(vectorLs) ||
      this.damageCondition(vectorUs) ||
      this.damageCondition(vectorWs)
    ) {
      this.setState({
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
        hp: 5,
        gameOverFlag: true
      });

      //this.props.navigation.navigate('Main');
    } else {
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
    }
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
      // updatePreview();
      // gl.endFrameEXP();

      this.setState({ frameCounter: this.state.frameCounter + 1 });

      // Função que recebe o proóximo frame e retorna ao início do loop
      requestAnimationFrame(loop);
    };
    loop();
  };

  renderTensorCamera(textureDims, tensorDims) {
    return (
      <View>
        {false ? <Text style={styles.detectionText}>Estimating hands. Check log at the console.</Text> : null}
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

  renderHP = (hp) => {
    return (
      <LottieView source={require('../../assets/4894-heart.json')} loop autoplay autosize={false} style={{ width: 100, height: 100 }}/>
    )
  } 

  gameOverSingleplayerModal = (navigation) => {
    const { gameOverFlag } = this.state; 
    return (
      <View style={{ alignSelf: 'center', alignItems: 'center' }}>
        <Modal 
        animationType='slide'
        hardwareAccelerated
        visible={gameOverFlag}
        onRequestClose={() => setModal(false)}
        transparent
        >
          <Text style={styles.modalTextStyle}>Fim de jogo</Text>
          <Text style={[styles.modalSubTextStyle ]}>Pontuação: {this.state.dropsPontuation} </Text>
          <View style={{ flex: 1, borderColor: 'red', borderWidth: 1 }}>
            <TouchableOpacity style={{ marginTop: SCREEN_HEIGHT * .4 }}>
              <Button 
                title='Jogar novamente'
                onPress={() => {
                  this.setState({ gameOverFlag: false });
                  this.render();
                }}
                buttonStyle={styles.ButtonStd}
              />
            </TouchableOpacity>

            <TouchableOpacity>
              <Button 
                title='Sair'
                onPress={() => {
                  this.setState({ gameOverFlag: false });
                  navigation.navigate('Main');
                }}
                buttonStyle={{ ...styles.ButtonStd, marginTop: SCREEN_HEIGHT * .015 }}
              />
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
      
    )
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
      drops,
      hp,
      gameOverFlag
    } = this.state;

    if (hasPermission === true) {
      //Carrega o componente do TensorCamera e permite a visualização câmera se showTensor === true
      return (
        <View style={styles.absoluteBackground}>
          {!gameOverFlag ? this.renderTensorCamera(textureDims, tensorDims) : null}
          {!gameOverFlag ? drops : null}
          {this.gameOverSingleplayerModal(this.props.navigation)}
        </View>
      );
    } else {
      // Tela de carregamento inicial
      return this.loadingScreen(isTfReady, isModelReady, hasPermission);
    }
  }
}

const styles = StyleSheet.create({
  modalTextStyle: {
    fontWeight: 'bold', 
    textAlign: 'center', 
    alignSelf: 'center',
    paddingTop: SCREEN_HEIGHT * .29, 
    position: 'absolute',
    fontSize: Dimensions.get('screen').fontScale * 35,
    color: '#dbdfef'
  },
  modalSubTextStyle: {
    fontWeight: 'bold', 
    textAlign: 'center', 
    alignSelf: 'center',
    paddingTop: SCREEN_HEIGHT * .35, 
    position: 'absolute',
    fontSize: Dimensions.get('screen').fontScale * 22,
    color: '#dbdfef'
  },
  tfCameraView: {
    width: 1,
    height: 1,
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
  absoluteBackground: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height * 1.25,
    backgroundColor: '#263056',
  },
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
});

export default TrackHandsScreen;
