import { Button as RNEButton, useTheme } from '@rneui/themed';
import { Image, ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';

import Icon, { IconProps } from '../Icon';

interface ButtonProps {
  disabled?: boolean;
  icon?: IconProps['icon'];
  iconColor?: string;
  iconImage?: ImageSourcePropType;
  kind?: 'primary' | 'secondary' | 'tertiary';
  onPress?(): void;
  text?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

const Button = ({
  text,
  onPress,
  kind = 'primary',
  icon,
  iconColor,
  iconImage,
  disabled,
  containerStyle,
}: ButtonProps) => {
  const { theme } = useTheme();

  const isPrimary = kind === 'primary';
  const isSecondary = kind === 'secondary';
  const isTertiary = kind === 'tertiary';
  const hasIcon = Boolean(icon || iconImage);

  const labelColor =
    isSecondary || isTertiary ? theme.colors.black : theme.colors.grey0;

  const backgroundColor =
    !disabled && isPrimary
      ? theme.colors.primary
      : !disabled && isSecondary
        ? theme.colors.grey0
        : theme.colors.white;

  const resolvedIconColor = iconColor ?? labelColor;

  const iconNode = iconImage ? (
    <Image source={iconImage} style={{ width: 22, height: 22 }} />
  ) : icon ? (
    <Icon icon={icon} color={resolvedIconColor} size={22} />
  ) : undefined;

  return (
    <RNEButton
      onPress={onPress}
      disabled={disabled}
      containerStyle={containerStyle}
      title={text}
      icon={iconNode}
      iconPosition="left"
      buttonStyle={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: isSecondary ? 'flex-start' : 'center',
        borderRadius: 14,
        backgroundColor,
        paddingVertical: 15,
        paddingHorizontal: 20,
        minHeight: 54,
        minWidth: '100%',
        borderWidth: isTertiary ? 1.5 : 0,
        borderColor: isTertiary ? '#C4BDB4' : 'transparent',
      }}
      titleStyle={{
        fontFamily: 'Commissioner_400Regular',
        fontSize: 16,
        letterSpacing: 0.2,
        color: labelColor,
        marginLeft: hasIcon ? 12 : 0,
      }}
    />
  );
};

export default Button;
