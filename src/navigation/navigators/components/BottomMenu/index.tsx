import { useKeyboard } from '@react-native-community/hooks';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles } from '@rneui/themed';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomMenuItem from 'components/BottomMenuItem';

import type { HomeNavigatorParamList } from 'navigation/types';

import { menuItems } from './data';

export interface BottomMenuProps
  extends StackNavigationProp<HomeNavigatorParamList> {}

const BottomMenu = () => {
  const { navigate } = useNavigation<BottomMenuProps>();
  const { keyboardShown } = useKeyboard();
  const styles = useStyles();
  const shouldHideMenu = keyboardShown && Platform.OS === 'android';

  return (
    <SafeAreaView
      edges={['left', 'right', 'bottom']}
      style={shouldHideMenu ? { display: 'none' } : styles.bottomMenu}
    >
      {menuItems.map(menu => (
        <BottomMenuItem
          key={menu.title}
          icon={menu.icon}
          title={menu.title}
          onPress={() => navigate(menu.screen)}
        />
      ))}
    </SafeAreaView>
  );
};

const useStyles = makeStyles(theme => ({
  bottomMenu: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'android' ? 12 : 0,
    paddingHorizontal: 52,
  },
}));

export default BottomMenu;
