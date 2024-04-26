import { Input } from "@rneui/themed";

import Icon from "../Icon";

interface InputProps {
  placeholder?: string;
  kind?: string;
  icon?: string;
}

const CustomInput = ({ placeholder, kind, icon }: InputProps) => {
  return (
    <Input
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
    />
  );
};

export default CustomInput;
