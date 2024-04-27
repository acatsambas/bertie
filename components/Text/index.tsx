import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import { Text, useTheme } from "@rneui/themed";
import { useCallback } from "react";

interface TextProps {
  kind: "header" | "paragraph" | "button";
  text: string;
  onPress?(): void;
}

SplashScreen.preventAutoHideAsync();

const CustomText = ({ kind, text, onPress }: TextProps) => {
  const { theme } = useTheme();

  const [fontsLoaded, fontError] = useFonts({
    "Goudy Bookletter 1911": require("../../assets/fonts/GoudyBookletter1911-Regular.ttf"),
    Commissioner: require("../../assets/fonts/Commissioner.ttf"),
    "Commissioner Regular": require("../../assets/fonts/static/Commissioner-Regular.ttf"),
    "Commissioner Bold": require("../../assets/fonts/static/Commissioner-Bold.ttf"),
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
    <Text
      onLayout={onLayoutRootView}
      style={{
        fontFamily:
          kind === "header"
            ? "Goudy Bookletter 1911"
            : kind === "paragraph"
            ? "Commissioner Regular"
            : "Commissioner Bold",
        fontSize: kind === "header" ? 24 : 16,
        color:
          kind === "button" ? theme.colors.primary : theme.colors.secondary,
      }}
      onPress={onPress}
    >
      {text}
    </Text>
  );
};
//kind === "header" ? "" : ""
export default CustomText;
