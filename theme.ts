import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#008080', // Islamic green
    accent: '#f1c40f', // Example accent color
    background: '#ffffff',
    surface: '#ffffff',
    text: '#000000',
    disabled: '#cccccc',
    placeholder: '#aaaaaa',
    backdrop: 'rgba(0,0,0,0.5)',
    notification: '#ff80ab', // Example notification color
  },
};
