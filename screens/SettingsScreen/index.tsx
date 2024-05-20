import React from "react";
import { View } from "react-native";
import Text from "../../components/Text";
import { SafeAreaView } from "react-native-safe-area-context";

const SettingsScreen = () => {
  return (
    <SafeAreaView>
      <Text kind="paragraph" text="SettingsScreen" />
    </SafeAreaView>
  );
};

export default SettingsScreen;
