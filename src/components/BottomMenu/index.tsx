import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles } from '@rneui/themed';
import { View } from 'react-native';

import { AppNavigatorParamList } from 'navigation/AppStack/params';

import { menuItems } from 'utils/data';

import BottomMenuItem from '../BottomMenuItem';

export interface BottomMenuProps
  extends StackNavigationProp<AppNavigatorParamList, 'LibraryNavigator'> {}

const BottomMenu = () => {
  const { replace } = useNavigation<BottomMenuProps>();
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <View style={styles.bottomMenu}>
        {menuItems.map(menu => (
          <BottomMenuItem
            key={menu.title}
            icon={menu.icon}
            title={menu.title}
            onPress={() => replace(menu.screen)}
          />
        ))}
      </View>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  },
  bottomMenu: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 60,
    width: '100%',
    backgroundColor: theme.colors.white,
    paddingVertical: 25,
  },
}));

export default BottomMenu;
