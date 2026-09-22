import { Icon as RNEIcon, IconProps as RNEIconProps } from '@rneui/themed';

export interface IconProps extends Omit<RNEIconProps, 'name' | 'type'> {
  icon: keyof typeof iconType;
}

const Icon = ({ icon, onPress, accessibilityRole, ...props }: IconProps) => {
  return (
    <RNEIcon
      {...props}
      onPress={onPress}
      accessibilityRole={accessibilityRole ?? (onPress ? 'button' : 'image')}
      type={iconType[icon].type}
      name={iconType[icon].name}
    />
  );
};

const iconType = {
  email: {
    type: 'material-design',
    name: 'email-outline',
  },
  password: {
    type: 'octicon',
    name: 'key',
  },
  myList: {
    type: 'material-design',
    name: 'format-list-bulleted',
  },
  discover: {
    type: 'octicon',
    name: 'search',
  },
  search: {
    type: 'octicon',
    name: 'search',
  },
  order: {
    type: 'material-design',
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
    type: 'material-design',
    name: 'close',
  },
  right: {
    type: 'material-design',
    name: 'chevron-right',
  },
  down: {
    type: 'material-design',
    name: 'chevron-down',
  },
  minus: {
    type: 'material-design',
    name: 'minus-circle-outline',
  },
  plus: {
    type: 'material-design',
    name: 'plus',
  },
  left: {
    type: 'material-design',
    name: 'arrow-u-left-top',
  },
  back: {
    type: 'material-design',
    name: 'arrow-left',
  },
  info: {
    type: 'material-design',
    name: 'information-outline',
  },
  import: {
    type: 'material-design',
    name: 'tray-arrow-down',
  },
  dotsHorizontal: {
    type: 'material-design',
    name: 'dots-vertical',
  },
  filter: {
    type: 'material-design',
    name: 'filter-variant',
  },
  radioOn: {
    type: 'material-design',
    name: 'radiobox-marked',
  },
  radioOff: {
    type: 'material-design',
    name: 'radiobox-blank',
  },
  book: {
    type: 'material-design',
    name: 'book-outline',
  },
  bookshop: {
    type: 'material-design',
    name: 'storefront-outline',
  },
  insights: {
    type: 'material-design',
    name: 'chart-box-outline',
  },
};

export default Icon;
