import { Text as RNEText, useTheme } from '@rneui/themed';

interface TextProps {
  kind:
    | 'bigHeader'
    | 'header'
    | 'paragraph'
    | 'description'
    | 'littleText'
    | 'button';
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
          : kind === 'button'
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
  bigHeader: { size: 36, fontFamily: 'GoudyBookletter1911_400Regular' },
  header: { size: 24, fontFamily: 'GoudyBookletter1911_400Regular' },
  paragraph: { size: 16, fontFamily: 'Commissioner_400Regular' },
  description: { size: 14, fontFamily: 'Commissioner_400Regular' },
  littleText: { size: 12, fontFamily: 'Commissioner_400Regular' },
  button: { size: 16, fontFamily: 'Commissioner_700Bold' },
};

export default Text;
