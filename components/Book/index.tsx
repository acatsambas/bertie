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
  return (
    <TouchableOpacity style={styles.container}>
      {kind !== "order" && (
        <CheckBox
          wrapperStyle={styles.wrapper}
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
      )}
    </TouchableOpacity>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    minWidth: "100%",
  },
  wrapper: { gap: 20 },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
}));

export default Book;
