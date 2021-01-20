import React, { Component } from 'react';
import { Text, View, StyleSheet, ImageBackground } from 'react-native';

export class Drop extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('./Drop3.png')}
          style={[
            styles.image,
            { left: this.props.position[0], top: this.props.position[1] },
          ]}
        >
          <Text style={styles.text}>{this.props.text}</Text>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'column',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  image: {
    // position: 'absolute',
    width: 60,
    height: 90,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 28,
    paddingTop: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    // backgroundColor: '#000000a0',
  },
});

export default Drop;
