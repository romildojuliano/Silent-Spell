import React from 'react';
import { 
    StyleSheet,
    Text,
    View,
    Dimensions,
    StatusBar,
    TouchableOpacity
} from 'react-native';

import * as tf from '@tensorflow/tfjs';
import * as tfrn from '@tensorflow/tfjs-react-native';
import * as jpeg from 'jpeg-js';
import * as handpose from '@tensorflow-models/handpose';

class App extends React.Component {
    state = {
        isTfReady: false,
        model: null
    };

    async classifyImage() {
        try {   
            const imageUri = 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Hand_-_Thumb.jpg'
            
        } catch (_error) {
            console.log(_error);
            
        }
    }

    async componentDidMount() {
        await tf.ready();
        const model = await handpose.load();
        this.setState({ isTfReady: true, model });
    }

    imageToTensor(rawImageData) {
        const TO_UINT8ARRAY = true;
        const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY);
        
        const buffer = new Uint8Array(width * height * 3);
        let offset = 0;
        for (let i = 0; i < buffer.length; i += 3) {
            buffer[i] = data[offset]
            buffer[i + 1] = data[offset + 1]
            buffer[i + 2] = data[offset + 2]
      
            offset += 4
        }

        return tf.tensor3d(buffer, [height, width, 3]);    
    }



    render () {
        return (
            <View>
                {
                this.state.isTfReady ? 
                <Text style={styles.text}>
                    Modules loaded
                </Text> 
                :
                <Text style={styles.text}>
                    Loading modules...
                </Text>
            } 
            </View>
        );
    }
}

const styles = StyleSheet.create({
    text: {
      textAlign: 'center', 
      marginTop: Dimensions.get('window').height * .5, 
      fontSize: 14, 
      fontWeight: 'bold'
    }
});

export default App;