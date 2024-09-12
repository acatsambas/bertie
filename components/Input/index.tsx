import { TextInputProps } from "react-native";
import { Input as RNEInput } from "@rneui/themed";

import Icon from "../Icon";

interface InputProps extends TextInputProps {
  placeholder?: string;
  kind?: string;
  icon?: string;
}

const Input = ({ placeholder, kind, icon, ...inputProps }: InputProps) => {
  return (
    <RNEInput
      {...inputProps}
      placeholder={placeholder}
      secureTextEntry={kind === "password" ? true : false}
      leftIcon={icon && <Icon icon={icon} />}
      inputContainerStyle={{
        backgroundColor: kind === "search" ? "#FDF9F6" : "#EEE9E4",
        borderRadius: 15,
        borderBottomColor: kind !== "search" ? "transparent" : "gray",
        paddingVertical: 7,
        paddingLeft: 20,
        gap: 10,
        borderWidth: kind === "search" ? 1 : 0,
      }}
      inputStyle={{ fontFamily: "Commissioner Regular" }}
    />
  );
};

export default Input;
