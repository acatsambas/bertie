import { makeStyles } from '@rneui/themed';
import React from 'react';
import { View } from 'react-native';

/** Widest the desktop content column grows before it centres in the window. */
export const DESKTOP_CONTENT_MAX_WIDTH = 1080;

/**
 * Holds a screen in a centred column on desktop, so layouts built for a phone
 * don't stretch across the whole window.
 */
const DesktopColumn = ({ children }: React.PropsWithChildren) => {
  const styles = useStyles();

  return (
    <View style={styles.outer}>
      <View style={styles.inner}>{children}</View>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  outer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.white,
  },
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: DESKTOP_CONTENT_MAX_WIDTH,
    paddingHorizontal: 20,
  },
}));

export default DesktopColumn;
