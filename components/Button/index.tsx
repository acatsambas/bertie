import { Button, useTheme } from "@rneui/themed";
import Icon from "../Icon";

interface ButtonProps {
  text?: string;
  onPress?(): void;
  kind?: "primary" | "secondary";
  icon?: string;
}

const CustomButton = ({ text, onPress, kind, icon }: ButtonProps) => {
  const { theme } = useTheme();

  return (
    <Button
      onPress={onPress}
      buttonStyle={{
        justifyContent: kind === "secondary" ? "flex-start" : "center",
        borderRadius: 15,
        backgroundColor:
          kind === "primary" ? theme.colors.primary : theme.colors.grey0,
        paddingVertical: 13,
        paddingHorizontal: 20,
        minWidth: "100%",
        gap: 10,
      }}
      titleStyle={{
        fontFamily: "Commissioner Regular",
        color: kind === "secondary" ? theme.colors.black : theme.colors.grey0,
      }}
    >
      {icon && <Icon icon={icon} />}
      {text}
    </Button>
  );
};

export default CustomButton;
