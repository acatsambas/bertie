import { TouchableOpacity } from 'react-native';

import { makeStyles } from '@rneui/themed';

import Icon, { IconProps } from '../Icon';
import Text from '../Text';

interface BottomMenuItemProps {
  icon: IconProps['icon'];
  title: string;
  onPress(): void;
}

const BottomMenuItem = ({ icon, title, onPress }: BottomMenuItemProps) => {
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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export default BottomMenuItem;
