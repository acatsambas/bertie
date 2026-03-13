import { ThemeProvider, createTheme } from '@rneui/themed';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PWAProvider } from 'contexts/PWAContext';
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
      await initFirebase();
      setFirebaseInitialised(true);
    })();
  }, []);

  if (!firebaseInitialised) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <PWAProvider>
          <FontsProvider>
            <QueryClientProvider client={queryClient}>
              <RootNavigator />
            </QueryClientProvider>
          </FontsProvider>
        </PWAProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
