import { Input as RNEInput, useTheme } from '@rneui/themed';
import { TextInputProps } from 'react-native';

import Icon, { IconProps } from '../Icon';

interface InputProps extends TextInputProps {
  placeholder?: string;
  kind?: string;
  marginTop?: number;
  icon?: IconProps['icon'];
  value: string;
}

const Input = ({
  placeholder,
  kind,
  icon,
  onChangeText,
  marginTop = 14,
  ...inputProps
}: InputProps) => {
  const { theme } = useTheme();

  const handleTextChange = (value: string) => {
    onChangeText?.(value);
  };

  const clearText = () => {
    onChangeText?.('');
  };

  return (
    <RNEInput
      {...inputProps}
      onChangeText={handleTextChange}
      placeholder={placeholder}
      secureTextEntry={kind === 'password' ? true : false}
      leftIcon={icon && <Icon icon={icon} />}
      rightIcon={
        inputProps.value?.length > 0 ? (
          <Icon icon="x" onPress={clearText} />
        ) : null
      }
      rightIconContainerStyle={{ margin: 0, padding: 0 }}
      inputContainerStyle={{
        backgroundColor:
          kind === 'search' ? theme.colors.white : theme.colors.grey0,
        borderRadius: 15,
        borderBottomColor: kind !== 'search' ? 'transparent' : 'gray',
        paddingVertical: 6,
        paddingLeft: 20,
        paddingRight: 10, // Add padding for the clear icon
        gap: 10,
        borderWidth: kind === 'search' ? 1 : 0,
        marginTop,
      }}
      inputStyle={{ fontFamily: 'Commissioner_400Regular' }}
    />
  );
};

export default Input;
