import { makeStyles, useTheme } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleProp, ViewStyle } from 'react-native';

import Icon from 'components/Icon';
import Text from 'components/Text';
import { translations } from 'locales/translations';

/**
 * Compact search chip next to the shelf filter. Opens the search screen.
 */
export const AddBookButton = ({
  onPress,
  style,
}: {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const label = t(translations.library.searchTitle);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={state => [
        styles.button,
        (state as { hovered?: boolean }).hovered && styles.buttonHovered,
        style,
      ]}
    >
      <Icon icon="search" size={18} color={theme.colors.secondary} />
      <Text
        kind="description"
        text={label}
        color={theme.colors.secondary}
        numberOfLines={1}
      />
    </Pressable>
  );
};

const useStyles = makeStyles(theme => ({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: theme.colors.grey0,
  },
  buttonHovered: { opacity: 0.9 },
}));

export default AddBookButton;
