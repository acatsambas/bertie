import { Text, useTheme } from "@rneui/themed";
import { makeStyles } from "@rneui/themed";

interface TextProps {
  kind: "header" | "paragraph" | "button";
  text: string;
  onPress?(): void;
}

const CustomText = ({ kind, text, onPress }: TextProps) => {
  const { theme } = useTheme();
  return (
    <Text
      style={{
        fontSize: kind === "header" ? 24 : 16,
        fontWeight: kind === "button" ? "700" : "400",
        color:
          kind === "button" ? theme.colors.primary : theme.colors.secondary,
      }}
      onPress={onPress}
    >
      {text}
    </Text>
  );
};

export default CustomText;
