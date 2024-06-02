import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";

import { makeStyles } from "@rneui/themed";

import { translations } from "../../locales/translations";
import Logo from "../../components/Logo";
import Illustration from "../../components/Illustration";
import Text from "../../components/Text";
import Button from "../../components/Button";
import GoogleButton from "../../components/AuthButtons/GoogleButton";
import AppleSigninButton from "../../components/AuthButtons/Apple";
import { AuthNavigatorParamList } from "../../navigation/AuthStack/params";

export interface WelcomePageProps
  extends StackNavigationProp<AuthNavigatorParamList, "Welcome"> {}

const WelcomeScreen = () => {
  const styles = useStyles();
  const { navigate } = useNavigation<WelcomePageProps>();
  const { t } = useTranslation();

  const handleLogin = () => {
    navigate("Login");
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.logo}>
        <Logo />
      </View>

      <Illustration name="welcome" />

      <View style={styles.container}>
        <View>
          <Text kind="header" text={t(translations.welcome.title)} />
        </View>

        <View style={styles.welcomeMessage}>
          <Text kind="paragraph" text={t(translations.welcome.purpose)} />
          <View>
            <Text kind="paragraph" text={t(translations.welcome.agree)} />
            <Text kind="button" text={t(translations.welcome.terms)} />
          </View>
        </View>

        <View style={styles.buttons}>
          <Button
            kind="primary"
            text={t(translations.welcome.email)}
            onPress={handleLogin}
          />
          <GoogleButton />
          <AppleSigninButton />
        </View>
      </View>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(() => ({
  safeAreaView: {
    flex: 1,
    gap: 20,
    padding: 20,
    justifyContent: "flex-start",
  },
  logo: {
    alignItems: "center",
    paddingTop: 30,
  },
  container: {
    flex: 1,
    gap: 20,
    width: "100%",
  },
  welcomeMessage: {
    flex: 1,
    gap: 20,
    alignItems: "flex-start",
  },
  buttons: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
}));

export default WelcomeScreen;
