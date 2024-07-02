import React from "react";
import { View } from "react-native";

import { makeStyles } from "@rneui/themed";

import Book from "../Book";

const OrderBooksList = () => {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <Book title="Infinite Jest" author="David Foster Wallance" kind="order" />
      <Book title="A Gentleman in Moscow" author="Amor Towles" kind="order" />
      <Book title="The Blind Assassin" author="Margaret Atwood" kind="order" />
    </View>
  );
};

const useStyles = makeStyles(() => ({
  container: { gap: 10 },
}));

export default OrderBooksList;
