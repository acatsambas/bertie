import { CheckBox as CustomCheckBox } from "@rneui/themed";
import { useEffect, useState } from "react";
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
    <CustomCheckBox checked={checked} onPress={handlePressCheck} {...props} />
  );
};

export default CheckBox;
