import React from "react";
import { View, TouchableOpacity } from "react-native";
import { CheckBox } from "@rneui/themed";
import { useEffect, useState } from "react";
import { TouchableOpacityProps } from "react-native";

import { makeStyles } from "@rneui/themed";

import Text from "../Text";
import Icon from "../Icon";

interface BookProps extends TouchableOpacityProps {
  author: string;
  title: string;
  kind?: "library" | "search" | "order";
  isChecked?: boolean;
  defaultValue?: boolean;
  onChange?: (value: boolean) => void;
}

const Book = ({
  author,
  title,
  kind,
  isChecked,
  defaultValue = false,
  ...props
}: BookProps) => {
  const styles = useStyles();

  const [checked, setChecked] = useState<boolean | undefined>(
    isChecked || defaultValue
  );

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

  const handlePressCheck = () => {
    if (props.disabled) return;

    const newValue = !checked;
    setChecked(newValue);
    props.onChange?.(newValue);
  };

  const handlePress = () => {
    //TODO: Navigates to book information
  };

  const handleDelete = () => {
    //TODO: Remove book from the cart
  };

  return (
    <TouchableOpacity style={styles.component}>
      {kind !== "order" ? (
        <CheckBox
          wrapperStyle={styles.wrapper}
          containerStyle={styles.container}
          checked={checked}
          onPress={handlePressCheck}
          {...props}
          title={
            <View style={styles.content}>
              <View>
                <Text text={title} kind="paragraph" />
                <Text text={author} kind="author" />
              </View>
              <Icon icon="right" />
            </View>
          }
        />
      ) : (
        <View style={styles.removeBookContainer}>
          <View>
            <Text text={title} kind="paragraph" />
            <Text text={author} kind="author" />
          </View>
          <Icon color="red" icon="minus" onPress={handleDelete} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const useStyles = makeStyles(() => ({
  component: {
    minWidth: "100%",
  },
  wrapper: { gap: 20 },
  container: {
    minWidth: "100%",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  removeBookContainer: {
    backgroundColor: "#F8EBDD",
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  },
}));

export default Book;
