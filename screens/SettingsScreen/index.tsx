import React, { useContext } from "react";
import { View } from "react-native";
import Text from "../../components/Text";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../api/auth/AuthProvider";
import Button from "../../components/Button";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SettingsNavigatorParamList } from "../../navigation/AppStack/params";

export interface SettingsPageProps
  extends StackNavigationProp<SettingsNavigatorParamList, "Settings"> {}

const SettingsScreen = () => {
  const { navigate } = useNavigation<SettingsPageProps>();

  const { logout } = useContext(AuthContext);
  const handleLogout = async () => {
    await logout();
  };

  const handleChangeAddress = () => {
    navigate("ChangeAddress");
  };

  return (
    <SafeAreaView>
      <Text kind="paragraph" text="SettingsScreen" />
      <Button onPress={handleLogout} />
      <Button onPress={handleChangeAddress} text="Change Address" />
    </SafeAreaView>
  );
};

export default SettingsScreen;
