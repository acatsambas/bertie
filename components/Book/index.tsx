import React from "react";
import { View } from "react-native";

import CheckBox from "../CheckBox";
import Text from "../Text";
import Icon from "../Icon";

interface BookType {
  kind: "current" | "past" | "search" | "remove";
}

const Book = ({ kind }: BookType) => {
  return (
    <View>
      {(kind === "current" || "past") && <CheckBox />}
      <Text kind="paragraph" text="Title" />
      <Text kind="paragraph" text="Author" />
      <Icon icon="right" />
    </View>
  );
};

export default Book;
