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
        paddingVertical: 15,
        minWidth: "100%",
      }}
      titleStyle={{
        fontFamily: "Commissioner Regular",
        color: kind === "secondary" ? theme.colors.primary : theme.colors.white,
      }}
      // containerStyle={{ paddingVertical: 13 }}
    />
  );
};

export default CustomButton;
