import { Input } from "@rneui/themed";

import Icon from "../Icon";
import { TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  placeholder?: string;
  kind?: string;
  icon?: string;
}

const CustomInput = ({
  placeholder,
  kind,
  icon,
  ...inputProps
}: InputProps) => {
  return (
    <Input
      {...inputProps}
      placeholder={placeholder}
      secureTextEntry={kind === "password" ? true : false}
      leftIcon={icon && <Icon icon={icon} />}
      inputContainerStyle={{
        backgroundColor: "#EEE9E4",
        borderRadius: 15,
        borderBottomColor: "transparent",
        paddingVertical: 5,
        paddingLeft: 20,
        gap: 10,
      }}
      inputStyle={{ fontFamily: "Commissioner Regular" }}
    />
  );
};

export default CustomInput;
