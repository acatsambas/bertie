import { Button as RNEButton, useTheme } from '@rneui/themed';

import Icon, { IconProps } from '../Icon';

interface ButtonProps {
  disabled?: boolean;
  icon?: IconProps['icon'];
  kind?: 'primary' | 'secondary' | 'tertiary';
  onPress?(): void;
  text?: string;
}

const Button = ({ text, onPress, kind, icon, disabled }: ButtonProps) => {
  const { theme } = useTheme();

  return (
    <RNEButton
      onPress={onPress}
      disabled={disabled}
      buttonStyle={{
        justifyContent: kind === 'secondary' ? 'flex-start' : 'center',
        borderRadius: 15,
        backgroundColor:
          kind === 'primary' && !disabled
            ? theme.colors.primary
            : kind === 'secondary' && !disabled
              ? theme.colors.grey0
              : theme.colors.white,
        paddingVertical: 13,
        paddingHorizontal: 20,
        minWidth: '100%',
        gap: 10,
        borderWidth: kind === 'tertiary' ? 1 : 0,
      }}
      titleStyle={{
        fontFamily: 'Commissioner_400Regular',
        color:
          kind === 'secondary' || kind === 'tertiary'
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
