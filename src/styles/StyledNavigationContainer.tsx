import { NavigationContainer } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

const StyledNavigationContainer = ({ children }) => {
  const { theme } = useTheme();

  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer
        navigationInChildEnabled
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
