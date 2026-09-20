import { makeStyles } from '@rneui/themed';
import { useIsDesktop } from 'hooks/useIsDesktop';
import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackTitleHeader } from 'components/BackTitleHeader';
import { DESKTOP_PAGE_PADDING_TOP } from 'components/DesktopColumn';
import { FORM_PAGE_MAX_WIDTH } from 'components/pageMaxWidth';

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
          isDesktop ? styles.scrollDesktop : null,
          stickyFooter ? styles.scrollWithStickyFooter : null,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.column}>
          <BackTitleHeader title={title} onBack={onBack} />
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
    paddingTop: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  scrollDesktop: {
    paddingTop: DESKTOP_PAGE_PADDING_TOP,
  },
  scrollWithStickyFooter: {
    paddingBottom: 24,
  },
  column: {
    width: '100%',
    maxWidth: FORM_PAGE_MAX_WIDTH,
    gap: 20,
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
