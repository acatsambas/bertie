import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { makeStyles } from "@rneui/themed";

import BottomMenuItem from "../BottomMenuItem";
import { menuItems } from "../../utils/data";
import { AppNavigatorParamList } from "../../navigation/AppStack/params";

export interface BottomMenuProps
  extends StackNavigationProp<AppNavigatorParamList, "Discover"> {}

const BottomMenu = () => {
  const { navigate } = useNavigation<BottomMenuProps>();
  const styles = useStyles();
  return (
    <View style={styles.bottomMenu}>
      {menuItems.map((menu) => (
        <BottomMenuItem
          key={menu.title}
          icon={menu.icon}
          title={menu.title}
          onPress={() => navigate(menu.screen)}
        />
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
