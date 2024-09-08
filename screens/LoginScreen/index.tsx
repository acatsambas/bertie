import { useContext, useState } from "react";

import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";

import { translations } from "../../locales/translations";
import { AuthNavigatorParamList } from "../../navigation/AuthStack/params";
import { AuthContext } from "../../api/auth/AuthProvider";
import { isFirebaseError } from "../../api/types";

import { makeStyles } from "@rneui/themed";

import Logo from "../../components/Logo";
import Button from "../../components/Button";
import Text from "../../components/Text";
import Input from "../../components/Input";

export interface LoginPageProps
  extends StackNavigationProp<AuthNavigatorParamList, "Login"> {}

const LoginScreen = () => {
  const styles = useStyles();
  const { navigate } = useNavigation<LoginPageProps>();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);

  const handleInputEmail = (value: string) => {
    setEmail(value.toLowerCase().trim());
  };

  const handleInputPassword = (value: string) => {
    setPassword(value);
  };

  const handleSignup = () => {
    navigate("Register");
  };

  const handleForgot = () => {
    navigate("Forgot");
  };

  const handlePressLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      //TODO: handle error
      if (isFirebaseError(error)) {
        console.log("ERROR");
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.logo}>
        <Logo />
      </View>

      <View style={styles.container}>
        <Text kind="header" text={t(translations.login.title)} />
        <View>
          <Input
            placeholder={t(translations.login.email)}
            icon="email"
            onChangeText={handleInputEmail}
          />
          <Input
            placeholder={t(translations.login.password)}
            kind="password"
            icon="password"
            onChangeText={handleInputPassword}
          />
          <View style={styles.forgot}>
            <Text
              kind="button"
              text={t(translations.login.forgot)}
              onPress={handleForgot}
            />
          </View>
        </View>
      </View>
      <View style={styles.bottomArea}>
        <Button
          kind="primary"
          text={t(translations.login.button)}
          onPress={handlePressLogin}
        />
        <View style={styles.signUp}>
          <Text kind="paragraph" text={t(translations.login.create)} />
          <Text
            kind="button"
            text={t(translations.login.signup)}
            onPress={handleSignup}
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
  forgot: { alignItems: "flex-end" },
  bottomArea: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 20,
    gap: 10,
  },
  signUp: { flexDirection: "row", justifyContent: "center", gap: 5 },
}));

export default LoginScreen;
