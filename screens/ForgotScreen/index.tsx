import { SafeAreaView } from "react-native-safe-area-context";

import { makeStyles } from "@rneui/themed";

import Logo from "../../components/Logo";
import Text from "../../components/Text";
import { View } from "react-native";
import Input from "../../components/Input";
import Button from "../../components/Button";

const ForgotScreen = () => {
  const styles = useStyles();
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.logo}>
        <Logo />
      </View>
      <View style={styles.container}>
        <Text kind="header" text="Forgot Password?" />
        <View>
          <Text
            kind="paragraph"
            text="Enter your email address to reset your password."
          />
          <Text
            kind="paragraph"
            text="We'll send an email with instructions on how to reset your it."
          />
        </View>
        <Input
          placeholder="Enter your email address"
          kind="email"
          icon="email"
        />
      </View>
      <View style={styles.bottomArea}>
        <Button kind="primary" text="Reset" />
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
  bottomArea: { flex: 1, justifyContent: "flex-end" },
}));

export default ForgotScreen;
