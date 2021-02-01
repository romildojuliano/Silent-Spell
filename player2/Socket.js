import React, { Component } from 'react';
import { View, Button } from 'react-native';
import io from 'socket.io-client';

const URL = 'ws://192.168.0.115:5000';
let socket;

// eslint-disable-next-line react/prefer-stateless-function
export class Socket extends Component {
  constructor(props) {
    super(props);

    this.SelectSpell = (index) => {
      const { magias } = this.state;
      this.setState({ chosen: magias[index] });
      console.log(`Magia${index + 1} escolhida!`);
    };

    this.state = {
      chosen: { type: '', element: '', confidence: 0.0 },
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
      console.log(JSON.parse(data));
      this.setState({ chosen: { type: '', element: '', confidence: 0.0 } });
    });

    socket.on('start_turn', (data) => {
      console.log('Novo turno!');
      console.log(data);
      setTimeout(() => {
        console.log('fim do turno');
        // const index = Math.floor(Math.random() * 2);
        // this.SelectSpell(index);
        const { chosen } = this.state;
        socket.emit('end_turn', chosen);
      }, 5000);
    });
  }

  render() {
    return (
      <View>
        <Button
          title="Magia1"
          onPress={() => {
            this.SelectSpell(0);
          }}
        />

        <Button
          title="Magia2"
          onPress={() => {
            this.SelectSpell(1);
          }}
        />
      </View>
    );
  }
}

export default Socket;
