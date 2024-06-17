import { Text as RNEText, useTheme } from "@rneui/themed";

interface TextProps {
  kind: "bigHeader" | "header" | "paragraph" | "littleText" | "button";
  text: string;
  onPress?(): void;
}

const Text = ({ kind, text, onPress }: TextProps) => {
  const { theme } = useTheme();

  return (
    <RNEText
      style={{
        fontFamily: kind in textKind && textKind[kind].fontFamily,
        fontSize: kind in textKind && textKind[kind].size,
        color:
          kind === "button" ? theme.colors.primary : theme.colors.secondary,
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
  littleText: { size: 12, fontFamily: "Commissioner Regular" },
  button: { size: 16, fontFamily: "Commissioner Bold" },
};

export default Text;
