import { useState } from "react";
import { TextInputProps, View } from "react-native";
import { Input as RNEInput } from "@rneui/themed";
import Icon from "../Icon";

interface InputProps extends TextInputProps {
  placeholder?: string;
  kind?: string;
  icon?: string;
}

const Input = ({ placeholder, kind, icon, onChangeText, ...inputProps }: InputProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleTextChange = (value: string) => {
    setInputValue(value);
    onChangeText && onChangeText(value);  // Keep calling parent handler
  };

  const clearText = () => {
    setInputValue("");
    onChangeText && onChangeText("");  // Notify parent of the cleared value
  };

  return (
    <RNEInput
      {...inputProps}
      value={inputValue}
      onChangeText={handleTextChange}
      placeholder={placeholder}
      secureTextEntry={kind === "password" ? true : false}
      leftIcon={icon && <Icon icon={icon} />}
      rightIcon={
        inputValue.length > 0 ? (
          <Icon icon="x" onPress={clearText} />
        ) : null
      }
      inputContainerStyle={{
        backgroundColor: kind === "search" ? "#FDF9F6" : "#EEE9E4",
        borderRadius: 15,
        borderBottomColor: kind !== "search" ? "transparent" : "gray",
        paddingVertical: 7,
        paddingLeft: 20,
        paddingRight: 10,  // Add padding for the clear icon
        gap: 10,
        borderWidth: kind === "search" ? 1 : 0,
      }}
      inputStyle={{ fontFamily: "Commissioner Regular" }}
    />
  );
};

export default Input;
