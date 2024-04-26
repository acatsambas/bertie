import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../../components/Logo";
import Text from "../../components/Text";

const RegisterScreen = () => {
  return (
    <SafeAreaView>
      <Logo />
      <Text kind="paragraph" text="Register Screen" />
    </SafeAreaView>
  );
};

export default RegisterScreen;
