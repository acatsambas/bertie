import { Button, useTheme } from "@rneui/themed";

interface ButtonProps {
  text?: string;
  onPress?(): void;
  kind?: "primary" | "secondary";
}

const CustomButton = ({ text, onPress, kind }: ButtonProps) => {
  const { theme } = useTheme();

  return (
    <Button
      title={text}
      onPress={onPress}
      buttonStyle={{
        borderRadius: 15,
        backgroundColor:
          kind === "primary" ? theme.colors.primary : theme.colors.white,
      }}
      titleStyle={{
        fontSize: 16,
        fontWeight: "400",
        color: kind === "secondary" ? theme.colors.primary : theme.colors.white,
      }}
      containerStyle={{ paddingVertical: 13 }}
    />
  );
};

export default CustomButton;
