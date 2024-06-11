import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { View } from "react-native";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

import { makeStyles } from "@rneui/themed";

import { translations } from "../../locales/translations";
import { SettingsNavigatorParamList } from "../../navigation/AppStack/params";
import { AuthContext } from "../../api/auth/AuthProvider";
import Button from "../../components/Button";
import Text from "../../components/Text";

export interface SettingsPageProps
  extends StackNavigationProp<SettingsNavigatorParamList, "Settings"> {}

const SettingsScreen = () => {
  const { navigate } = useNavigation<SettingsPageProps>();
  const { t } = useTranslation();
  const styles = useStyles();

  const { logout } = useContext(AuthContext);
  const handleLogout = async () => {
    await logout();
  };

  const handleChangeAddress = () => {
    navigate("ChangeAddress");
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Text kind="header" text={t(translations.settings.title)} />
        <Button onPress={handleChangeAddress} text="Change Address" />
      </View>
      <View style={styles.bottomArea}>
        <Button
          kind="primary"
          text={t(translations.settings.signout)}
          onPress={handleLogout}
        />
        <Text kind="paragraph" text={t(translations.settings.version)} />
      </View>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(() => ({
  safeAreaView: {
    flex: 1,
    gap: 20,
    paddingHorizontal: 20,
  },
  container: { paddingTop: 20, gap: 20 },
  bottomArea: { flex: 1, alignItems: "center", gap: 20 },
}));

export default SettingsScreen;
