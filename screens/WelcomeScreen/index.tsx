import Text from "../../components/Text";
import { SafeAreaView } from "react-native-safe-area-context";

import { makeStyles } from "@rneui/themed";

const WelcomeScreen = () => {
  const styles = useStyles();
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Text kind="header" text="Welcome to Bertie!" />
    </SafeAreaView>
  );
};

const useStyles = makeStyles(() => ({
  safeAreaView: {
    flex: 1,
    alignItems: "center",
    gap: 20,
    padding: 20,
  },
}));

export default WelcomeScreen;
