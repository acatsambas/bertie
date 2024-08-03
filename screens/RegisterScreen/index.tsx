import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";

import { makeStyles } from "@rneui/themed";

import { translations } from "../../locales/translations";
import Logo from "../../components/Logo";
import Button from "../../components/Button";
import Text from "../../components/Text";
import Input from "../../components/Input";
import { AuthNavigatorParamList } from "../../navigation/AuthStack/params";
import { useState } from "react";

export interface RegisterPageProps
  extends StackNavigationProp<AuthNavigatorParamList, "Register"> {}

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const styles = useStyles();
  const { navigate } = useNavigation<RegisterPageProps>();
  const { t } = useTranslation();

  const handleInputEmail = (value: string) => {
    setEmail(value.toLowerCase().trim());
  };

  const handleInputPassword = (value: string) => {
    setPassword(value);
  };

  const handleLogin = () => {
    navigate("Login");
  };

  const handleRegister = () => {
    const validRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (email.match(validRegex)) {
      navigate("SetProfile", { email: email, password: password });
    } else {
      setError(true);
    }
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
          <View>
            <Text kind="paragraph" text={t(translations.signup.agree)} />
            <Text kind="button" text={t(translations.signup.terms)} />
          </View>
        </View>
        {error && (
          <View style={styles.error}>
            <Text kind="paragraph" text={t(translations.signup.mailError)} />
          </View>
        )}
      </View>
      <View style={styles.bottomArea}>
        <Button
          kind="primary"
          text={t(translations.signup.button)}
          onPress={handleRegister}
        />
        <View style={styles.logIn}>
          <Text kind="paragraph" text={t(translations.signup.already)} />
          <Text
            kind="button"
            text={t(translations.signup.login)}
            onPress={handleLogin}
          />
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
  bottomArea: { flex: 1, justifyContent: "flex-end", marginBottom: 20 },
  logIn: { flexDirection: "row", justifyContent: "center", gap: 5 },
}));

export default RegisterScreen;
