import { Icon } from "@rneui/themed";

interface IconProps {
  icon: string;
}

const CustomIcon = ({ icon }: IconProps) => {
  return (
    <Icon
      type={icon in iconType && iconType[icon].type}
      name={icon in iconType && iconType[icon].name}
      containerStyle={{}}
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
};

export default CustomIcon;
