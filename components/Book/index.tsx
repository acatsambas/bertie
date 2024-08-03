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
  onPress,
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

  return (
    <View>
      {kind !== "order" ? (
        <View style={styles.container}>
          <CheckBox
            containerStyle={{ backgroundColor: "transparent" }}
            checked={checked}
            onPress={handlePressCheck}
            iconType="material-community"
            checkedIcon={
              kind === "library" ? "checkbox-outline" : "plus-circle-outline"
            }
            uncheckedIcon={
              kind === "library"
                ? "checkbox-blank-outline"
                : "plus-circle-outline"
            }
            checkedColor={kind === "library" ? "gray" : "#38AD59"}
            uncheckedColor={kind === "search" && "black"}
            {...props}
          />
          <TouchableOpacity style={styles.content} onPress={onPress}>
            <View>
              <Text
                text={title}
                kind="paragraph"
                color={checked && kind === "library" && "grey"}
              />
              <Text
                text={author}
                kind="littleText"
                color={checked && kind === "library" && "grey"}
              />
            </View>
            <Icon
              icon="right"
              color={checked && kind === "library" && "grey"}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.removeBookContainer}>
          <View>
            <Text text={title} kind="paragraph" />
            <Text text={author} kind="littleText" />
          </View>
          <Icon color="red" icon="minus" />
        </View>
      )}
    </View>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    paddingRight: 20,
    flexDirection: "row",
    minWidth: "100%",
  },

  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  removeBookContainer: {
    minWidth: "100%",
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
