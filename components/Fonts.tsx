import { useCallback } from "react";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

const Fonts = ({ children }) => {
  const [fontsLoaded, fontError] = useFonts({
    "Goudy Bookletter 1911": require("../assets/fonts/GoudyBookletter1911-Regular.ttf"),
    Commissioner: require("../assets/fonts/Commissioner.ttf"),
    "Commissioner Regular": require("../assets/fonts/static/Commissioner-Regular.ttf"),
    "Commissioner Bold": require("../assets/fonts/static/Commissioner-Bold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>{children}</SafeAreaProvider>
  );
};

export default Fonts;
