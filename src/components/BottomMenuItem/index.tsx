import { makeStyles, useTheme } from '@rneui/themed';
import { TouchableOpacity, View } from 'react-native';

import Icon, { IconProps } from '../Icon';
import Text from '../Text';

interface BottomMenuItemProps {
  icon: IconProps['icon'];
  title: string;
  onPress(): void;
  badgeCount?: number;
  badgeAccessibilityLabel?: string;
}

const BottomMenuItem = ({
  icon,
  title,
  onPress,
  badgeCount = 0,
  badgeAccessibilityLabel,
}: BottomMenuItemProps) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const showBadge = badgeCount > 0;

  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      accessibilityLabel={
        showBadge && badgeAccessibilityLabel
          ? `${title}, ${badgeAccessibilityLabel}`
          : title
      }
    >
      <View style={styles.iconWrap}>
        <Icon icon={icon} />
        {showBadge && (
          <View style={styles.badge} accessibilityElementsHidden>
            <Text
              kind="littleText"
              text={badgeCount > 99 ? '99+' : String(badgeCount)}
              color={theme.colors.white}
              style={styles.badgeText}
            />
          </View>
        )}
      </View>
      <Text text={title} kind="paragraph" />
    </TouchableOpacity>
  );
};

const useStyles = makeStyles(theme => ({
  menuItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconWrap: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  badgeText: {
    fontFamily: 'Commissioner_700Bold',
    fontSize: 10,
    lineHeight: 12,
  },
}));

export default BottomMenuItem;
