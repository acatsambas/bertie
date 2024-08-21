import React from "react";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { makeStyles } from "@rneui/themed";

import { translations } from "../../locales/translations";
import { OrderNavigatorParamList } from "../../navigation/AppStack/params";
import BottomMenu from "../../components/BottomMenu";
import Text from "../../components/Text";
import OrderBooksList from "../../components/OrderBooksList";
import Button from "../../components/Button";

export interface OrderPageProps
  extends StackNavigationProp<OrderNavigatorParamList, "Order"> {}

const OrderScreen = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { navigate } = useNavigation<OrderPageProps>();

  const handleNext = () => {
    navigate("OrderShop");
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Text text={t(translations.order.title)} kind="bigHeader" />
        <Text text={t(translations.order.header)} kind="header" />
        <OrderBooksList />
        <Text text={t(translations.order.details)} kind="header" />
        <FlatList
          data={[
            { key: "First Name" },
            { key: "Last Name" },
            { key: "Email" },
            { key: "Address" },
          ]}
          renderItem={({ item }) => {
            return (
              <View style={{ marginBottom: 10 }}>
                <Text text={`\u2022 ${item.key}`} kind="description" />
              </View>
            );
          }}
        />
      </View>
      <View style={styles.bottomArea}>
        <Button
          kind="primary"
          text={t(translations.order.next)}
          onPress={handleNext}
        />
        <BottomMenu />
      </View>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(() => ({
  safeAreaView: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#FDF9F6",
    position: "relative",
  },
  container: { paddingTop: 20, gap: 20 },
  bottomArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 20,
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
  },
}));

export default OrderScreen;
