import React from "react";
import { View, TouchableOpacity } from "react-native";

import { makeStyles } from "@rneui/themed";

import CheckBox from "../CheckBox";
import Text from "../Text";
import Icon from "../Icon";

interface BookType {
  kind: "current" | "past" | "search" | "remove";
}

const Book = ({ kind }: BookType) => {
  const styles = useStyles();

  const handlePress = () => {
    //TODO: Navigates to book information
  };
  return (
    <View style={styles.container}>
      {(kind === "current" || kind === "past") && <CheckBox />}
      <TouchableOpacity
        onPress={handlePress}
        style={styles.interactiveContainer}
      >
        <View style={styles.texts}>
          <Text kind="paragraph" text="Title" />
          <Text kind="author" text="Author" />
        </View>
        {kind !== "remove" && <Icon icon="right" />}
      </TouchableOpacity>
    </View>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  texts: {
    flexDirection: "column",
  },
  interactiveContainer: {
    flexDirection: "row",
  },
}));

export default Book;
