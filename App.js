import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import AuthScreen from './src/screens/AuthScreen';
import TrackHandsScreen from './src/screens/TrackHandsScreen';
import RegisterSCreen from './src/screens/RegisterScreen';

const navigator = createStackNavigator(
  {
    Auth: AuthScreen,
    TrackHands: TrackHandsScreen,
    Register: RegisterSCreen
  },
  {
    initialRouteName: 'Auth',
    headerMode: 'none',
    mode: Platform.OS === "ios" ? "modal" : "card"
  }
);

export default createAppContainer(navigator);