import { CheckBox as CustomCheckBox } from "@rneui/themed";
import { useState } from "react";
import { TouchableOpacityProps } from "react-native";

interface CheckBoxProps extends TouchableOpacityProps {
  isChecked?: boolean;
  defaultValue?: boolean;
  onChange?: (value: boolean) => void;
}

const CheckBox = ({
  isChecked,
  defaultValue = false,
  ...props
}: CheckBoxProps) => {
  const [checked, setChecked] = useState<boolean | undefined>(
    isChecked || defaultValue
  );

  return <CustomCheckBox checked={checked} {...props} />;
};

export default CheckBox;
