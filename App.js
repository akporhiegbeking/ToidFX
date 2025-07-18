// --------------------------------------------------------------------
// SYSTEM COMPONENTS
// --------------------------------------------------------------------
import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from "expo-splash-screen";
import AppNavigation from './src/navigation';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

const App = () => {
  // ------------------------------------------------------------
  // status bar color state
  // ------------------------------------------------------------
  const StyleTypes = ["default", "dark-content", "light-content"];
  const [visibleStatusBar, sentvisibleStatusBar] = useState(false);
  const [styleStatusBar, setStyleStatusBar] = useState(StyleTypes[0]);
  // ------------------------------------------------------------
  // fonts
  // ------------------------------------------------------------
  let [fontsLoaded] = useFonts({
    "Archivo-Regular": require("./assets/fonts/Archivo-Regular.ttf"),
    "Archivo-ExtraBold": require("./assets/fonts/Archivo-ExtraBold.ttf"),
    "FREEFATFONT-Regular": require("./assets/fonts/FREEFATFONT-Regular.otf"),
  });

  useEffect(() => {
    async function prepare(){
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, [])

  if (!fontsLoaded) {
    return undefined;
  } else {
    SplashScreen.hideAsync();
  }

  return (
    <BottomSheetModalProvider>
      <AppNavigation />
    </BottomSheetModalProvider>
  );
}

export default App