import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import AuthScreen from './src/screens/AuthScreen';
import TrackHandsScreen from './src/screens/TrackHandsScreen';

const navigator = createStackNavigator(
  {
    Auth: AuthScreen,
    TrackHands: TrackHandsScreen
  },
  {
    initialRouteName: 'Auth',
    headerMode: 'none',
  }
);

export default createAppContainer(navigator);