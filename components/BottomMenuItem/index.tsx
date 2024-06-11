import { View } from "react-native";

import { makeStyles } from "@rneui/themed";

import Text from "../Text";
import Icon from "../Icon";

interface BottomMenuItem {
  icon: string;
  title: string;
}

const BottomMenuItem = ({ icon, title }: BottomMenuItem) => {
  const styles = useStyles();
  return (
    <View style={styles.menuItem}>
      <Icon icon={icon} />
      <Text text={title} kind="paragraph" />
    </View>
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
