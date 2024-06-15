import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { makeStyles } from "@rneui/themed";
import { translations } from "../../locales/translations";
import BottomMenu from "../../components/BottomMenu";
import Text from "../../components/Text";

const OrderScreen = () => {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <View>
          <Text text={t(translations.order.title)} kind="bigHeader" />
        </View>
      </View>
      <View style={styles.bottomArea}>
        <BottomMenu />
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

export default OrderScreen;
