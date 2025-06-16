import { AppRegistry } from 'react-native';
import App from './src/navigation/AppNavigator'; // Assuming AppNavigator.tsx exports the main App component
import { name as appName } from './app.json'; // Assuming app.json exists and has the app name

AppRegistry.registerComponent(appName, () => App);
