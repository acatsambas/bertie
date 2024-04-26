import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../../components/Logo";
import Text from "../../components/Text";

const ForgotScreen = () => {
  return (
    <SafeAreaView>
      <Logo />
      <Text kind="paragraph" text="Forgot Screen" />
    </SafeAreaView>
  );
};

export default ForgotScreen;
