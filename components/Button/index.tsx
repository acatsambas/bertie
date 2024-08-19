import { Button as RNEButton, useTheme } from "@rneui/themed";
import Icon from "../Icon";

interface ButtonProps {
  text?: string;
  onPress?(): void;
  kind?: "primary" | "secondary" | "tertiary";
  icon?: string;
}

const Button = ({ text, onPress, kind, icon }: ButtonProps) => {
  const { theme } = useTheme();

  return (
    <RNEButton
      onPress={onPress}
      buttonStyle={{
        justifyContent: kind === "secondary" ? "flex-start" : "center",
        borderRadius: 15,
        backgroundColor:
          kind === "primary"
            ? theme.colors.primary
            : kind === "secondary"
            ? theme.colors.grey0
            : theme.colors.white,
        paddingVertical: 13,
        paddingHorizontal: 20,
        minWidth: "100%",
        gap: 10,
        borderWidth: kind === "tertiary" ? 1 : 0,
      }}
      titleStyle={{
        fontFamily: "Commissioner Regular",
        color:
          kind === "secondary" || kind === "tertiary"
            ? theme.colors.black
            : theme.colors.grey0,
      }}
    >
      {icon && <Icon icon={icon} />}
      {text}
    </RNEButton>
  );
};

export default Button;
