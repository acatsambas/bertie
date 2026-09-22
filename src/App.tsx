import 'locales/i18n';

import { ThemeProvider, createTheme } from '@rneui/themed';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from 'api/auth/AuthProvider';
import { initFirebase } from 'api/firebase';
import { GuestProvider } from 'api/guest/GuestProvider';
import { DraftOrderProvider } from 'contexts/DraftOrderContext';
import { PWAProvider } from 'contexts/PWAContext';
import { ToastProvider } from 'contexts/ToastContext';
import RootNavigator from 'navigation/RootNavigator';
import { FontsProvider } from 'styles/FontsProvider';

const theme = createTheme({
  lightColors: {
    primary: '#565EAF',
    secondary: '#222222',
    grey0: '#EEE9E4',
    white: '#FDF9F6',
  },
  mode: 'light',
  components: {
    Tab: {
      variant: 'default',
    },
  },
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
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <PWAProvider>
            <FontsProvider>
              <QueryClientProvider client={queryClient}>
                <GuestProvider>
                  <DraftOrderProvider>
                    <ToastProvider>
                      <RootNavigator />
                    </ToastProvider>
                  </DraftOrderProvider>
                </GuestProvider>
              </QueryClientProvider>
            </FontsProvider>
          </PWAProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
