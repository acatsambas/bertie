import { Text as RNEText, useTheme } from "@rneui/themed";

interface TextProps {
  kind:
    | "bigHeader"
    | "header"
    | "paragraph"
    | "description"
    | "littleText"
    | "button";
  text: string;
  onPress?(): void;
  color?: string;
}

const Text = ({ kind, text, onPress, color }: TextProps) => {
  const { theme } = useTheme();

  return (
    <RNEText
      style={{
        fontFamily: kind in textKind && textKind[kind].fontFamily,
        fontSize: kind in textKind && textKind[kind].size,
        color: color
          ? color
          : kind === "button"
          ? theme.colors.primary
          : theme.colors.secondary,
      }}
      onPress={onPress}
    >
      {text}
    </RNEText>
  );
};

const textKind = {
  bigHeader: { size: 36, fontFamily: "Goudy Bookletter 1911" },
  header: { size: 24, fontFamily: "Goudy Bookletter 1911" },
  paragraph: { size: 16, fontFamily: "Commissioner Regular" },
  description: { size: 14, fontFamily: "Commissioner Regular" },
  littleText: { size: 12, fontFamily: "Commissioner Regular" },
  button: { size: 16, fontFamily: "Commissioner Bold" },
};

export default Text;
