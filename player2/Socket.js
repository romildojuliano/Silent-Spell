import React, { Component } from 'react';
import { TextInput, View, Button } from 'react-native';
import io from 'socket.io-client';

const URL = 'http://192.168.0.115:5000';
let socket;

// eslint-disable-next-line react/prefer-stateless-function
export class Socket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      magias: [
        { type: 'A', element: 'EILUW', confidence: '1' },
        { type: 'D', element: 'UWLCE', confidence: '2' },
      ],
    };
  }

  componentDidMount() {
    socket = io.connect(URL);

    socket.on('connect', () => {
      console.log('Conectou');
    });

    socket.on('update_hp', (data) => {
      console.log(data);
    });

    socket.on('start_turn', (data) => {
      console.log('Novo turno!');
      console.log(data);
      setTimeout(() => {
        console.log('fim do turno');
        const index = Math.floor(Math.random() * 2);
        const { magias } = this.state;
        socket.emit('end_turn', magias[index]);
      }, 10000);
    });
  }

  render() {
    return (
      <View>
        {/* <Button
          title="magia1"
          onPress={() => {
            const { msg1, msg2 } = this.state;
            socket.emit('end_turn', msg1);
            console.log('end_turn message');
          }}
        />

        <Button
          title="magia2"
          onPress={() => {
            const { msg1, msg2 } = this.state;
            socket.emit('end_turn', msg2);
            console.log('end_turn message');
          }}
        /> */}
      </View>
    );
  }
}

export default Socket;
