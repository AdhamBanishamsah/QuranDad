import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import audioManager from './utils/audioManager';

import WelcomeScreen from './screens/WelcomeScreen';
import MainScreen from './screens/MainScreen';
import QuranListScreen from './screens/QuranListScreen';
import SurahPlayerScreen from './screens/SurahPlayerScreen';
import AboutDeveloperScreen from './screens/AboutDeveloperScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import GlobalFloatingPlayer from './components/GlobalFloatingPlayer';

const Stack = createStackNavigator();

// Custom fade transition configuration
const customFadeTransition = {
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 300,
        easing: require('react-native').Easing.out(require('react-native').Easing.cubic),
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 300,
        easing: require('react-native').Easing.in(require('react-native').Easing.cubic),
      },
    },
  },
  cardStyleInterpolator: ({ current }) => {
    return {
      cardStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.3],
        }),
      },
    };
  },
};

export default function App() {
  useEffect(() => {
    // Cleanup audio when app is closed
    return () => {
      audioManager.cleanup();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor="transparent" translucent />
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#1a1a2e' },
            ...customFadeTransition,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        >
          <Stack.Screen 
            name="Welcome" 
            component={WelcomeScreen}
          />
          <Stack.Screen 
            name="Main" 
            component={MainScreen}
          />
          <Stack.Screen 
            name="QuranList" 
            component={QuranListScreen}
          />
          <Stack.Screen 
            name="SurahPlayer" 
            component={SurahPlayerScreen}
          />
          <Stack.Screen 
            name="AboutDeveloper" 
            component={AboutDeveloperScreen}
          />
          <Stack.Screen 
            name="PrivacyPolicy" 
            component={PrivacyPolicyScreen}
          />
        </Stack.Navigator>
        <GlobalFloatingPlayer />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
