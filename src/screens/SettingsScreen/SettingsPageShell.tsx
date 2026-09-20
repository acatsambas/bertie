import { makeStyles } from '@rneui/themed';
import { useIsDesktop } from 'hooks/useIsDesktop';
import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Icon from 'components/Icon';
import { FORM_PAGE_MAX_WIDTH } from 'components/pageMaxWidth';
import Text from 'components/Text';

type SettingsPageShellProps = {
  title: string;
  onBack?: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export const SettingsPageShell = ({
  title,
  onBack,
  children,
  footer,
}: SettingsPageShellProps) => {
  const styles = useStyles();
  const isDesktop = useIsDesktop();
  const stickyFooter = Boolean(footer) && !isDesktop;

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          stickyFooter ? styles.scrollWithStickyFooter : null,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.column}>
          <View style={styles.header}>
            {onBack ? <Icon icon="back" onPress={onBack} /> : null}
            <Text kind="bigHeader" text={title} />
          </View>
          {children}
          {footer && !stickyFooter ? (
            <View style={styles.inlineFooter}>{footer}</View>
          ) : null}
        </View>
      </ScrollView>
      {stickyFooter ? (
        <View style={styles.footerOuter}>
          <View style={styles.footerInner}>{footer}</View>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

const useStyles = makeStyles(theme => ({
  safeAreaView: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  scroll: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 40,
    flexGrow: 1,
  },
  scrollWithStickyFooter: {
    paddingBottom: 24,
  },
  column: {
    width: '100%',
    maxWidth: FORM_PAGE_MAX_WIDTH,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inlineFooter: {
    marginTop: 12,
  },
  footerOuter: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.grey0,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  footerInner: {
    width: '100%',
    maxWidth: FORM_PAGE_MAX_WIDTH,
  },
}));
