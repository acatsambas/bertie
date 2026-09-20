import { makeStyles } from '@rneui/themed';
import type { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

type SoftCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Light bordered panel — same surface as the Goodreads import cards.
 * Export the style hook so Pressables (e.g. the side-rail account) can share it.
 */
export const useSoftCardStyles = makeStyles(theme => ({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.grey0,
    backgroundColor: '#FFFFFF',
  },
}));

export const SoftCard = ({ children, style }: SoftCardProps) => {
  const styles = useSoftCardStyles();
  return <View style={[styles.card, style]}>{children}</View>;
};
