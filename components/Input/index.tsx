import { Input as RNEInput } from '@rneui/themed';
import { TextInputProps } from 'react-native';

import Icon, { IconProps } from '../Icon';

interface InputProps extends TextInputProps {
  placeholder?: string;
  kind?: string;
  icon?: IconProps['icon'];
  value: string;
}

const Input = ({
  placeholder,
  kind,
  icon,
  onChangeText,
  ...inputProps
}: InputProps) => {
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
      inputContainerStyle={{
        backgroundColor: kind === 'search' ? '#FDF9F6' : '#EEE9E4',
        borderRadius: 15,
        borderBottomColor: kind !== 'search' ? 'transparent' : 'gray',
        paddingVertical: 7,
        paddingLeft: 20,
        paddingRight: 10, // Add padding for the clear icon
        gap: 10,
        borderWidth: kind === 'search' ? 1 : 0,
      }}
      inputStyle={{ fontFamily: 'Commissioner_400Regular' }}
    />
  );
};

export default Input;
