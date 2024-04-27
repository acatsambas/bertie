import { Text, useTheme } from "@rneui/themed";

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
        fontFamily:
          kind === "header"
            ? "Goudy Bookletter 1911"
            : kind === "paragraph"
            ? "Commissioner Regular"
            : "Commissioner Bold",
        fontSize: kind === "header" ? 24 : 16,
        color:
          kind === "button" ? theme.colors.primary : theme.colors.secondary,
      }}
      onPress={onPress}
    >
      {text}
    </Text>
  );
};
//kind === "header" ? "" : ""
export default CustomText;
