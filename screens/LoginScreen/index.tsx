import { makeStyles } from "@rneui/themed";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginScreen = () => {
  const styles = useStyles();
  return (
    <SafeAreaView style={styles.container}>
      <Text>Login Page</Text>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
}));

export default LoginScreen;
