import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { makeStyles } from "@rneui/themed";

import { translations } from "../../locales/translations";
import { View } from "react-native";
import Text from "../../components/Text";
import Input from "../../components/Input";
import Button from "../../components/Button";

const ResetScreen = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Text text={t(translations.reset.title)} kind="header" />
        <Text text={t(translations.reset.enterPassword)} kind="paragraph" />
        <Input placeholder={t(translations.reset.placeholder1)} />
        <Text text={t(translations.reset.newPassword)} kind="paragraph" />
        <Input placeholder={t(translations.reset.placeholder2)} />
        <Text text={t(translations.reset.confirmPassword)} kind="paragraph" />
        <Input placeholder={t(translations.reset.placeholder2)} />
      </View>
      <View style={styles.bottomArea}>
        <Button text={t(translations.reset.button)} kind="primary" />
      </View>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(() => ({
  safeAreaView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  container: { paddingTop: 20, gap: 20 },
  bottomArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
}));

export default ResetScreen;
