import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { makeStyles } from '@rneui/themed';

import { AppNavigatorParamList } from '../../navigation/AppStack/params';
import { menuItems } from '../../utils/data';
import BottomMenuItem from '../BottomMenuItem';

export interface BottomMenuProps
  extends StackNavigationProp<AppNavigatorParamList, 'LibraryNavigator'> {}

const BottomMenu = () => {
  const { replace } = useNavigation<BottomMenuProps>();
  const styles = useStyles();
  return (
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
  );
};

const useStyles = makeStyles(() => ({
  bottomMenu: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 60,
    width: '100%',
    backgroundColor: '#FDF9F6',
    paddingVertical: 25,
  },
}));

export default BottomMenu;
