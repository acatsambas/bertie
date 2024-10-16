import { SafeAreaView } from "react-native-safe-area-context";
import { Platform, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

import { makeStyles } from "@rneui/themed";

import { translations } from "../../locales/translations";
import { AuthNavigatorParamList } from "../../navigation/AuthStack/params";
import Text from "../../components/Text";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import GoogleButton from "../../components/AuthButtons/GoogleButton";
import AppleSigninButton from "../../components/AuthButtons/Apple";

const NoAccountScreen = ({ navigation }) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLogin = () => {};

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <View style={styles.top}>
          <Text kind="bigHeader" text={t(translations.noAccount.title)} />
          <Icon icon="left" onPress={handleBack} />
        </View>
        <Text kind="paragraph" text={t(translations.noAccount.paragraph)} />
        <View style={styles.buttons}>
          <Button
            kind="primary"
            text={t(translations.welcome.email)}
            onPress={handleLogin}
          />
          <GoogleButton />
          {Platform.OS === "ios" && <AppleSigninButton />}
        </View>
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
  container: { paddingTop: 20, gap: 20 },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 20,
  },
  buttons: {
    gap: 20,
  },
}));

export default NoAccountScreen;
