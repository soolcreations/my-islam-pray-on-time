import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import screens (to be created)
import CommunityFeedScreen from '../screens/CommunityFeedScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import PrayerScreen from '../screens/PrayerScreen';
import QuranScreen from '../screens/QuranScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Import store (to be created)
import store from '../store';

// Import theme (to be created)
import { theme } from '../utils/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main tab navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Statistics') {
            iconName = focused ? 'chart-bar' : 'chart-bar-outline';
          } else if (route.name === 'Prayer') {
            iconName = focused ? 'mosque' : 'mosque-outline';
          } else if (route.name === 'Quran') {
            iconName = focused ? 'book-open-variant' : 'book-open-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'bell' : 'bell-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={CommunityFeedScreen} />
      <Tab.Screen name="Statistics" component={StatisticsScreen} />
      <Tab.Screen name="Prayer" component={PrayerScreen} />
      <Tab.Screen name="Quran" component={QuranScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
    </Tab.Navigator>
  );
};

// Root stack navigator
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Root component with providers
const App = () => {
  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
          <AppNavigator />
        </SafeAreaProvider>
      </PaperProvider>
    </StoreProvider>
  );
};

export default App;
