import { makeStyles, useTheme } from '@rneui/themed';
import { Pressable, PressableProps, View } from 'react-native';

import Icon from '../Icon';
import Text from '../Text';

interface BookShopProps extends Omit<PressableProps, 'children'> {
  kind?: 'default' | 'favorite' | 'favoriteSelected';
  name: string;
  location: string;
}

const BookShop = ({
  kind = 'default',
  name,
  location,
  onPress,
  ...pressableProps
}: BookShopProps) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const isSelectable = kind === 'favorite' || kind === 'favoriteSelected';
  const isSelected = kind === 'favoriteSelected';

  if (kind === 'default') {
    return (
      <Pressable
        {...pressableProps}
        accessibilityRole="button"
        accessibilityLabel={`${name}, ${location}`}
        onPress={onPress}
        style={({ pressed }) => [styles.discoverRow, pressed && styles.pressed]}
      >
        <View style={styles.copy}>
          <Text text={name} kind="paragraph" />
          <Text text={location} kind="littleText" color={theme.colors.grey2} />
        </View>
        <Icon icon="right" size={18} color={theme.colors.grey2} />
      </Pressable>
    );
  }

  return (
    <Pressable
      {...pressableProps}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`${name}, ${location}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        isSelected ? styles.cardSelected : styles.cardIdle,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.copy}>
        <Text text={name} kind="paragraph" />
        <Text text={location} kind="littleText" color={theme.colors.grey2} />
      </View>
      {isSelectable ? (
        <Icon
          icon={isSelected ? 'radioOn' : 'radioOff'}
          size={24}
          color={isSelected ? theme.colors.primary : theme.colors.grey2}
        />
      ) : null}
    </Pressable>
  );
};

const useStyles = makeStyles(theme => ({
  discoverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: '100%',
    paddingVertical: 12,
    paddingHorizontal: 4,
    gap: 16,
    justifyContent: 'space-between',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: '100%',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 14,
    justifyContent: 'space-between',
  },
  cardIdle: {
    borderColor: theme.colors.grey0,
    backgroundColor: theme.colors.white,
  },
  cardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: '#EEF0F8',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  pressed: {
    opacity: 0.72,
  },
}));

export default BookShop;
