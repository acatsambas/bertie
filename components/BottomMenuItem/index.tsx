import { TouchableOpacity } from "react-native";

import { makeStyles } from "@rneui/themed";

import Text from "../Text";
import Icon from "../Icon";

interface BottomMenuItem {
  icon: string;
  title: string;
  onPress(): void;
}

const BottomMenuItem = ({ icon, title, onPress }: BottomMenuItem) => {
  const styles = useStyles();
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Icon icon={icon} />
      <Text text={title} kind="paragraph" />
    </TouchableOpacity>
  );
};

const useStyles = makeStyles(() => ({
  menuItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

export default BottomMenuItem;
