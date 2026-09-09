import { NavigationContainer } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { linking } from 'navigation/linking';
import { navigationRef } from 'navigation/navigationRef';

const StyledNavigationContainer = ({ children }) => {
  const { theme } = useTheme();

  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer
        ref={navigationRef}
        navigationInChildEnabled
        linking={linking}
        // React Navigation's own web title-sync walks to the deepest focused
        // screen and uses only *that* screen's own options.title, not any
        // ancestor's — so titles set higher up (e.g. AppNavigator's "My list"
        // for the whole Home tab) never actually reach the tab, and every
        // leaf screen here (LibraryScreen, DiscoverScreen, ...) sets none of
        // its own. Disabling it leaves the correct static "Bertie" from
        // public/index.html in place for all of them. BookScreen is
        // unaffected — it already sets document.title itself and restores it
        // to 'Bertie' on unmount, independent of this setting.
        documentTitle={{ enabled: false }}
        theme={{
          dark: false,
          colors: {
            background: theme.colors.white,
            border: theme.colors.divider,
            card: theme.colors.grey0,
            notification: theme.colors.warning,
            primary: theme.colors.primary,
            text: theme.colors.secondary,
          },
          fonts: {
            regular: {
              fontFamily: 'System',
              fontWeight: '400' as const,
            },
            medium: {
              fontFamily: 'System',
              fontWeight: '500' as const,
            },
            bold: {
              fontFamily: 'System',
              fontWeight: '700' as const,
            },
            heavy: {
              fontFamily: 'System',
              fontWeight: '900' as const,
            },
          },
        }}
      >
        {children}
      </NavigationContainer>
    </>
  );
};

export default StyledNavigationContainer;
