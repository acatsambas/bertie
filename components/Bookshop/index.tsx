import { makeStyles } from '@rneui/themed';
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

import Icon from 'components/Icon';
import Text from 'components/Text';

interface BookShopProps extends TouchableOpacityProps {
  kind?: 'default' | 'favorite' | 'favoriteSelected';
  name: string;
  location: string;
}

const BookShop = ({ kind, name, location, onPress }: BookShopProps) => {
  const styles = useStyles();

  return (
    <TouchableOpacity
      style={kind === 'favoriteSelected' ? styles.fav : styles.container}
      onPress={onPress}
    >
      <View>
        <Text text={name} kind="paragraph" />
        <Text text={location} kind="littleText" />
      </View>
      {kind === 'default' && <Icon icon="right" />}
    </TouchableOpacity>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: '100%',
    padding: 20,
    gap: 20,
    justifyContent: 'space-between',
  },
  fav: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: '100%',
    borderWidth: 1,
    borderRadius: 5,
    padding: 20,
    gap: 20,
    justifyContent: 'space-between',
  },
}));

export default BookShop;
