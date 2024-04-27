import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import { Input } from "@rneui/themed";

import Icon from "../Icon";
import { useCallback } from "react";

interface InputProps {
  placeholder?: string;
  kind?: string;
  icon?: string;
}

SplashScreen.preventAutoHideAsync();

const CustomInput = ({ placeholder, kind, icon }: InputProps) => {
  const [fontsLoaded, fontError] = useFonts({
    Commissioner: require("../../assets/fonts/Commissioner.ttf"),
    "Commissioner Regular": require("../../assets/fonts/static/Commissioner-Regular.ttf"),
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
    <Input
      onLayout={onLayoutRootView}
      placeholder={placeholder}
      secureTextEntry={kind === "password" ? true : false}
      leftIcon={icon && <Icon icon={icon} />}
      inputContainerStyle={{
        backgroundColor: "#EEE9E4",
        borderRadius: 15,
        borderBottomColor: "transparent",
        paddingVertical: 5,
        paddingLeft: 20,
        gap: 10,
      }}
      inputStyle={{ fontFamily: "Commissioner Regular" }}
    />
  );
};

export default CustomInput;
