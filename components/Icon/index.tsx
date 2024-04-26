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
};

export default CustomIcon;
