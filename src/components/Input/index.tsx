import { Input as RNEInput, useTheme } from '@rneui/themed';
import { useRef, useState } from 'react';
import { Platform, Pressable, TextInputProps, View } from 'react-native';

import Icon, { IconProps } from '../Icon';

interface InputProps extends TextInputProps {
  placeholder?: string;
  kind?: string;
  marginTop?: number;
  icon?: IconProps['icon'];
  value: string;
}

const CLEAR_ICON_SIZE = 24;
const INPUT_MIN_HEIGHT = 40;
const VERTICAL_PADDING = 6;

const Input = ({
  placeholder,
  kind,
  icon,
  onChangeText,
  onFocus,
  onBlur,
  marginTop = 14,
  ...inputProps
}: InputProps) => {
  const { theme } = useTheme();
  const inputRef = useRef<{ focus: () => void } | null>(null);
  const [focused, setFocused] = useState(false);
  const hasValue = (inputProps.value?.length ?? 0) > 0;
  const isSearch = kind === 'search';

  const idleBorderColor = isSearch ? 'gray' : 'transparent';
  const borderColor = focused ? theme.colors.primary : idleBorderColor;

  const iconColor = focused ? theme.colors.primary : undefined;

  const handleTextChange = (value: string) => {
    onChangeText?.(value);
  };

  const clearText = () => {
    onChangeText?.('');
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <Pressable
      onPress={focusInput}
      focusable={false}
      accessible={false}
      tabIndex={-1}
      style={{
        width: '100%',
        ...(Platform.OS === 'web' ? ({ cursor: 'text' } as object) : null),
      }}
    >
      <RNEInput
        ref={inputRef as never}
        {...inputProps}
        onChangeText={handleTextChange}
        onFocus={event => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={event => {
          setFocused(false);
          onBlur?.(event);
        }}
        placeholder={placeholder}
        secureTextEntry={kind === 'password' ? true : false}
        leftIcon={icon && <Icon icon={icon} color={iconColor} />}
        rightIcon={
          <View style={{ width: CLEAR_ICON_SIZE, height: CLEAR_ICON_SIZE }}>
            {hasValue ? <Icon icon="x" onPress={clearText} /> : null}
          </View>
        }
        containerStyle={{ width: '100%', paddingHorizontal: 0 }}
        renderErrorMessage={false}
        rightIconContainerStyle={{ margin: 0, padding: 0 }}
        inputContainerStyle={{
          backgroundColor: isSearch ? theme.colors.white : theme.colors.grey0,
          borderRadius: 14,
          borderWidth: 2,
          borderBottomWidth: 2,
          borderColor,
          paddingVertical: VERTICAL_PADDING,
          paddingLeft: 20,
          paddingRight: 10,
          gap: 10,
          marginTop,
          minHeight: INPUT_MIN_HEIGHT + VERTICAL_PADDING * 2,
        }}
        inputStyle={{
          fontFamily: 'Commissioner_400Regular',
          color: theme.colors.black,
          // @ts-expect-error caretColor / outline* are web-only RNW styles
          caretColor: theme.colors.primary,
          outlineWidth: 0,
          outlineStyle: 'none',
        }}
      />
    </Pressable>
  );
};

export default Input;
