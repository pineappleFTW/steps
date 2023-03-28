/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {Provider} from 'react-redux';
import {TamaguiProvider} from 'tamagui';
import {store} from './src/redux/store';
import AppNavigator from './src/screen/AuthenticatedScreen';

import config from './tamagui.config';

import {
  Toast,
  ToastImperativeProvider,
  ToastProvider,
  ToastViewport,
  useToast,
} from '@tamagui/toast';

const CurrentToast = () => {
  const {currentToast} = useToast();

  // only show the component if it's present and not handled by native toast
  if (!currentToast || currentToast.isHandledNatively) return null;
  return (
    <Toast key={currentToast.id}>
      <Toast.Title>{currentToast.title}</Toast.Title>
      <Toast.Description>{currentToast.message}</Toast.Description>
    </Toast>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <TamaguiProvider config={config}>
          <ToastProvider>
            <ToastImperativeProvider options={{native: 'mobile'}}>
              <CurrentToast />
              <AppNavigator />
            </ToastImperativeProvider>

            <ToastViewport />
          </ToastProvider>
        </TamaguiProvider>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
