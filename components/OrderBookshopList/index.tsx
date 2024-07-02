import React from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { makeStyles } from "@rneui/themed";

import { translations } from "../../locales/translations";
import Text from "../../components/Text";
import BookShop from "../Bookshop";

interface OrderBookshopListProps {
  kind: "favourites" | "more";
}

const OrderBookshopList = ({ kind }: OrderBookshopListProps) => {
  const styles = useStyles();
  const { t } = useTranslation();
  return (
    <View>
      {kind === "favourites" ? (
        <View>
          <Text kind="header" text={t(translations.order.favourites)} />
          <BookShop name="Daunt Books" location="London" />
          <BookShop
            name="John Sandoe Books"
            location="London"
            kind="favoriteSelected"
          />
        </View>
      ) : (
        <View style={styles.container}>
          <Text kind="header" text={t(translations.order.more)} />
          <View style={styles.purple}>
            <Text kind="paragraph" text={t(translations.order.add)} />
          </View>
          <BookShop name="Daunt Books" location="London" kind="default" />
        </View>
      )}
    </View>
  );
};

const useStyles = makeStyles(() => ({
  container: { gap: 20 },
  purple: {
    backgroundColor: "#F3EAFF",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
}));

export default OrderBookshopList;
