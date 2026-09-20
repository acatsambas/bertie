import { makeStyles } from '@rneui/themed';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FORM_PAGE_MAX_WIDTH } from 'components/pageMaxWidth';

type AuthPageShellProps = {
  children: ReactNode;
};

/**
 * Centres onboarding content in a capped column on large screens,
 * same treatment as SettingsPageShell.
 */
const AuthPageShell = ({ children }: AuthPageShellProps) => {
  const styles = useStyles();

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.outer}>
        <View style={styles.column}>{children}</View>
      </View>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(theme => ({
  safeAreaView: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  outer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  column: {
    flex: 1,
    width: '100%',
    maxWidth: FORM_PAGE_MAX_WIDTH,
  },
}));

export default AuthPageShell;
