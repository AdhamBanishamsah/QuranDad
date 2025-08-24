import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import audioManager from './utils/audioManager';

import WelcomeScreen from './screens/WelcomeScreen';
import MainScreen from './screens/MainScreen';
import SurahPlayerScreen from './screens/SurahPlayerScreen';
import GlobalFloatingPlayer from './components/GlobalFloatingPlayer';

const Stack = createStackNavigator();

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
          }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="SurahPlayer" component={SurahPlayerScreen} />
        </Stack.Navigator>
        <GlobalFloatingPlayer />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
