import React, { useContext } from "react";
import { View } from "react-native";
import Text from "../../components/Text";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../api/auth/AuthProvider";
import Button from "../../components/Button";

const SettingsScreen = () => {
  const { logout } = useContext(AuthContext);
  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView>
      <Text kind="paragraph" text="SettingsScreen" />
      <Button onPress={handleLogout} />
    </SafeAreaView>
  );
};

export default SettingsScreen;
