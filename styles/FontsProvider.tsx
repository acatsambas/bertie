import {
  Commissioner_100Thin,
  Commissioner_200ExtraLight,
  Commissioner_300Light,
  Commissioner_400Regular,
  Commissioner_500Medium,
  Commissioner_600SemiBold,
  Commissioner_700Bold,
  Commissioner_800ExtraBold,
  Commissioner_900Black,
} from '@expo-google-fonts/commissioner';
import { GoudyBookletter1911_400Regular } from '@expo-google-fonts/goudy-bookletter-1911';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export function FontsProvider({ children }: React.PropsWithChildren) {
  let [fontsLoaded] = useFonts({
    GoudyBookletter1911_400Regular,
    Commissioner_100Thin,
    Commissioner_200ExtraLight,
    Commissioner_300Light,
    Commissioner_400Regular,
    Commissioner_500Medium,
    Commissioner_600SemiBold,
    Commissioner_700Bold,
    Commissioner_800ExtraBold,
    Commissioner_900Black,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return children;
}
