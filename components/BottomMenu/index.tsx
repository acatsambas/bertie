import { View } from "react-native";

import { makeStyles } from "@rneui/themed";

import BottomMenuItem from "../BottomMenuItem";
import { menuItems } from "../../utils/data";

const BottomMenu = () => {
  const styles = useStyles();
  return (
    <View style={styles.bottomMenu}>
      {menuItems.map((menu) => (
        <BottomMenuItem key={menu.title} icon={menu.icon} title={menu.title} />
      ))}
    </View>
  );
};

const useStyles = makeStyles(() => ({
  bottomMenu: {
    display: "flex",
    flexDirection: "row",
    gap: 40,
  },
}));

export default BottomMenu;
