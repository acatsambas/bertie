import { ThemeProvider, createTheme } from '@rneui/themed';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { AuthProvider } from 'api/auth/AuthProvider';
import { initFirebase } from 'api/firebase';

import RootNavigator from 'navigation/RootNavigator';

import { FontsProvider } from 'styles/FontsProvider';

import 'locales/i18n';

const theme = createTheme({
  lightColors: {
    primary: '#565EAF',
    secondary: '#222222',
    grey0: '#EEE9E4',
    white: '#FDF9F6',
  },
  mode: 'light',
});

const queryClient = new QueryClient();

const App = () => {
  const [firebaseInitialised, setFirebaseInitialised] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await initFirebase();
      } catch (error) {
        console.error('Firebase initialization error:', error);
        // Continue rendering even if Firebase initialization fails
      } finally {
        setFirebaseInitialised(true);
      }
    })();
  }, []);

  if (!firebaseInitialised) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <FontsProvider>
          <QueryClientProvider client={queryClient}>
            <RootNavigator />
          </QueryClientProvider>
        </FontsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
