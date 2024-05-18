import { useContext, useState } from "react";

import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { AuthNavigatorParamList } from "../../navigation/AuthStack/params";
import { AuthContext } from "../../api/auth/AuthProvider";

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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);

  const handleSignup = () => {
    navigate("Register");
  };

  const handleForgot = () => {
    navigate("Forgot");
  };

  const handlePressLogin = async () => {};

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.logo}>
        <Logo />
      </View>

      <View style={styles.container}>
        <Text kind="header" text="Login" />
        <View>
          <Input placeholder="Email" kind="altceva" icon="email" />
          <Input placeholder="Password" kind="password" icon="password" />
          <View style={styles.forgot}>
            <Text
              kind="button"
              text="Forgot password?"
              onPress={handleForgot}
            />
          </View>
        </View>
      </View>
      <View style={styles.bottomArea}>
        <Button kind="primary" text="Login" onPress={handlePressLogin} />
        <View style={styles.signUp}>
          <Text kind="paragraph" text="Don't have an account? " />
          <Text kind="button" text="Sign up!" onPress={handleSignup} />
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
  },
  logo: {
    alignItems: "center",
    paddingTop: 20,
  },
  container: { paddingTop: 20, gap: 20 },
  forgot: { alignItems: "flex-end" },
  bottomArea: { flex: 1, justifyContent: "flex-end", marginBottom: 20 },
  signUp: { flexDirection: "row", justifyContent: "center" },
}));

export default LoginScreen;
