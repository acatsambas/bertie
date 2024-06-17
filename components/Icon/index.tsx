import { Icon as RNEIcon } from "@rneui/themed";

interface IconProps {
  icon: string;
  onPress?(): void;
  color?: string;
}

const Icon = ({ icon, onPress, color }: IconProps) => {
  return (
    <RNEIcon
      type={icon in iconType && iconType[icon].type}
      name={icon in iconType && iconType[icon].name}
      containerStyle={{}}
      onPress={onPress}
      color={color}
    />
  );
};

const iconType = {
  email: {
    type: "material-community",
    name: "email-outline",
  },
  password: {
    type: "octicon",
    name: "key",
  },
  myList: {
    type: "material-community",
    name: "format-list-bulleted",
  },
  discover: {
    type: "oction",
    name: "search",
  },
  order: {
    type: "material-community",
    name: "cart-outline",
  },
  address: {
    type: "feather",
    name: "map-pin",
  },
  delete: {
    type: "feather",
    name: "trash-2",
  },
  x: {
    type: "material-community",
    name: "close",
  },
  right: {
    type: "material-community",
    name: "chevron-right",
  },
  minus: {
    type: "material-community",
    name: "minus-circle-outline",
  },
};

export default Icon;
