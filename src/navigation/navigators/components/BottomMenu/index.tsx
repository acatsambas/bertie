import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles } from '@rneui/themed';
import { View } from 'react-native';

import BottomMenuItem from 'components/BottomMenuItem';

import type { HomeNavigatorParamList } from 'navigation/types';

import { menuItems } from './data';

export interface BottomMenuProps
  extends StackNavigationProp<HomeNavigatorParamList> {}

const BottomMenu = () => {
  const { navigate } = useNavigation<BottomMenuProps>();
  const styles = useStyles();
  return (
    <View style={styles.bottomMenu}>
      {menuItems.map(menu => (
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

const useStyles = makeStyles(theme => ({
  bottomMenu: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    paddingVertical: 12,
    paddingHorizontal: 52,
  },
}));

export default BottomMenu;
