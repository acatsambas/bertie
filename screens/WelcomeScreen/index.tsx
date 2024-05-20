import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { makeStyles } from "@rneui/themed";

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
          <Text kind="header" text="Welcome to Bertie!" />
        </View>

        <View style={styles.welcomeMessage}>
          <Text
            kind="paragraph"
            text="We help readers create reading lists and order books from independent bookshops."
          />
          <View>
            <Text kind="paragraph" text="By logging in, you agree to our" />
            <Text kind="button" text="Terms of Service & Privacy Policy" />
          </View>
        </View>

        <View style={styles.buttons}>
          <Button
            kind="primary"
            text="Continue with email"
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
  },
}));

export default WelcomeScreen;
