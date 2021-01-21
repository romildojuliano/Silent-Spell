import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native'

const ConfigScreen = () => {
  return (
    <View style={styles.absoluteBackground}>
      
    </View>
  );
}

const styles = StyleSheet.create({
  absoluteBackground: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height * 1.25,
    backgroundColor: '#263056',
    alignItems: 'center',
    paddingTop: Dimensions.get('screen').height * .05
  },

})

export default ConfigScreen;