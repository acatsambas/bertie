import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useContext, useState } from "react";

import { makeStyles } from "@rneui/themed";

import { translations } from "../../locales/translations";
import Logo from "../../components/Logo";
import Text from "../../components/Text";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { AuthContext } from "../../api/auth/AuthProvider";

const ForgotScreen = () => {
  const { t } = useTranslation();
  const styles = useStyles();
  const { forgot } = useContext(AuthContext);
  const [email, setEmail] = useState("");

  const handleInputEmail = (value: string) => {
    setEmail(value.toLowerCase().trim());
  };

  const handleForgot = async () => {
    await forgot(email);
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.logo}>
        <Logo />
      </View>
      <View style={styles.container}>
        <Text kind="header" text={t(translations.forgot.title)} />
        <View>
          <Text kind="paragraph" text={t(translations.forgot.enterEmail)} />
          <Text kind="paragraph" text={t(translations.forgot.sendEmail)} />
        </View>
        <Input
          placeholder={t(translations.forgot.placeholder)}
          kind="email"
          icon="email"
          onChangeText={handleInputEmail}
        />
      </View>
      <View style={styles.bottomArea}>
        <Button
          kind="primary"
          text={t(translations.forgot.button)}
          onPress={handleForgot}
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
  },
  logo: {
    alignItems: "center",
    paddingTop: 20,
  },
  container: { paddingTop: 20, gap: 20 },
  bottomArea: { flex: 1, justifyContent: "flex-end", marginBottom: 20 },
}));

export default ForgotScreen;
