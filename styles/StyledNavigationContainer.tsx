import { NavigationContainer } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';

const StyledNavigationContainer = ({ children }) => {
  const { theme } = useTheme();

  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer
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
        }}
      >
        {children}
      </NavigationContainer>
    </>
  );
};

export default StyledNavigationContainer;
