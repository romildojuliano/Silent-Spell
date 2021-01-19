import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const CheckUp = ({isTfReady, isModelReady, hasPermission}) => {
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
};

const styles = StyleSheet.create({
    loaded: {
      textAlign: 'center',
      textAlignVertical: 'center',
      color: 'green'
    },
    notLoaded: {
      textAlign: 'center',
      textAlignVertical: 'center',
      color: 'red'
    }
});

export default CheckUp;