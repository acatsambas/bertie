import { Icon as RNEIcon, IconProps as RNEIconProps } from '@rneui/themed';

export interface IconProps extends Omit<RNEIconProps, 'name' | 'type'> {
  icon: keyof typeof iconType;
}

const Icon = ({ icon, ...props }: IconProps) => {
  return (
    <RNEIcon
      {...props}
      type={icon in iconType && iconType[icon].type}
      name={icon in iconType && iconType[icon].name}
    />
  );
};

const iconType = {
  email: {
    type: 'material-community',
    name: 'email-outline',
  },
  password: {
    type: 'octicon',
    name: 'key',
  },
  myList: {
    type: 'material-community',
    name: 'format-list-bulleted',
  },
  discover: {
    type: 'oction',
    name: 'search',
  },
  order: {
    type: 'material-community',
    name: 'cart-outline',
  },
  address: {
    type: 'feather',
    name: 'map-pin',
  },
  delete: {
    type: 'feather',
    name: 'trash-2',
  },
  x: {
    type: 'material-community',
    name: 'close',
  },
  right: {
    type: 'material-community',
    name: 'chevron-right',
  },
  minus: {
    type: 'material-community',
    name: 'minus-circle-outline',
  },
  plus: {
    type: 'material-community',
    name: 'plus',
  },
  left: {
    type: 'material-community',
    name: 'arrow-u-left-top',
  },
};

export default Icon;
