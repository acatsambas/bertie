import { Linking, View } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";

import { makeStyles } from "@rneui/themed";

import { translations } from "../../locales/translations";
import { AuthNavigatorParamList } from "../../navigation/AuthStack/params";
import Logo from "../../components/Logo";
import Button from "../../components/Button";
import Text from "../../components/Text";
import Input from "../../components/Input";

export interface RegisterPageProps
  extends StackNavigationProp<AuthNavigatorParamList, "Register"> {}

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [mailError, setMailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const styles = useStyles();
  const { navigate } = useNavigation<RegisterPageProps>();
  const { t } = useTranslation();

  const handleInputEmail = (value: string) => {
    setEmail(value.toLowerCase().trim());
    setMailError(false);
  };

  const handleInputPassword = (value: string) => {
    setPassword(value);
    setPasswordError(false);
  };

  const handleInputPasswordCheck = (value: string) => {
    setCheckPassword(value);
    setPasswordError(false);
  };

  const handleLogin = () => {
    navigate("Login");
  };

  const handleRegister = () => {
    const validRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (email.match(validRegex)) {
      if (checkPassword === password) {
        navigate("SetProfile", { email: email, password: password });
      } else {
        setPasswordError(true);
      }
    } else {
      setMailError(true);
    }
  };

  const handlePrivacy = () => {
    Linking.openURL("https://www.bertieapp.com/privacypolicy.html");
  };
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.logo}>
        <Logo />
      </View>

      <View style={styles.container}>
        <Text kind="header" text={t(translations.signup.title)} />
        <View>
          <Input
            placeholder={t(translations.signup.email)}
            icon="email"
            onChangeText={handleInputEmail}
          />
          <Input
            placeholder={t(translations.signup.password)}
            kind="password"
            icon="password"
            onChangeText={handleInputPassword}
          />
          <Input
            placeholder={t(translations.signup.password2)}
            kind="password"
            icon="password"
            onChangeText={handleInputPasswordCheck}
          />
          <View>
            <Text kind="paragraph" text={t(translations.signup.agree)} />
            <Text
              kind="button"
              text={t(translations.signup.terms)}
              onPress={handlePrivacy}
            />
          </View>
        </View>
        {mailError && (
          <View style={styles.error}>
            <Text kind="paragraph" text={t(translations.signup.mailError)} />
          </View>
        )}
        {passwordError && (
          <View style={styles.error}>
            <Text kind="paragraph" text={t(translations.signup.pwNoMatch)} />
          </View>
        )}
      </View>
      <View style={styles.bottomArea}>
        <Button
          kind="primary"
          text={t(translations.signup.button)}
          onPress={handleRegister}
        />
        <Button
          kind="tertiary"
          text={t(translations.signup.explore)}
          onPress={handleRegister}
        />
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
  logo: {
    alignItems: "center",
    paddingTop: 20,
  },
  container: { paddingTop: 20, gap: 20 },
  error: {
    backgroundColor: "#FDEDED",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  bottomArea: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 20,
    gap: 20,
  },
}));

export default RegisterScreen;
