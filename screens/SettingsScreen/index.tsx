import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Linking, View } from "react-native";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

import { makeStyles } from "@rneui/themed";

import { translations } from "../../locales/translations";
import { SettingsNavigatorParamList } from "../../navigation/AppStack/params";
import { AuthContext } from "../../api/auth/AuthProvider";
import Button from "../../components/Button";
import Text from "../../components/Text";
import Icon from "../../components/Icon";

export interface SettingsPageProps
  extends StackNavigationProp<SettingsNavigatorParamList, "Settings"> {}

const SettingsScreen = ({ navigation }) => {
  const { navigate } = useNavigation<SettingsPageProps>();
  const { t } = useTranslation();
  const styles = useStyles();

  const { logout, user } = useContext(AuthContext);
  const handleLogout = async () => {
    await logout();
  };

  const handleChangeAddress = () => {
    navigate("ChangeAddress");
  };

  const handlePassword = () => {
    navigate("ResetPassword");
  };

  const handleDelete = () => {
    navigate("DeleteAccount");
  };

  const handleExit = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text kind="bigHeader" text={t(translations.settings.title)} />
          <Icon icon="x" onPress={handleExit} />
        </View>
        <Button
          kind="secondary"
          text={t(translations.settings.contactAddress)}
          icon="email"
          onPress={() =>
            Linking.openURL(`mailto:${t(translations.settings.contactAddress)}`)
          }
        />
        <View style={styles.buttonsArea}>
          <Button
            kind="secondary"
            onPress={handleChangeAddress}
            text={t(translations.settings.changeAddress)}
            icon="address"
          />
          {user.providerData[0].providerId === "password" && (
            <Button
              kind="secondary"
              onPress={handlePassword}
              text={t(translations.settings.reset)}
              icon="password"
            />
          )}
          <Button
            kind="secondary"
            onPress={handleDelete}
            text={t(translations.settings.delete)}
            icon="delete"
          />
        </View>
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
    backgroundColor: "#FDF9F6",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  container: { paddingTop: 20, gap: 20 },
  buttonsArea: { gap: 10, marginTop: 20 },
  bottomArea: { flex: 1, alignItems: "center", gap: 20 },
}));

export default SettingsScreen;
