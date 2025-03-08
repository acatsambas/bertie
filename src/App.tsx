import { ThemeProvider, createTheme } from '@rneui/themed';
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

const App = () => {
  const [firebaseInitƒ, setFirebaseInitƒ] = useState(false);

  useEffect(() => {
    (async () => {
      await initFirebase();
      setFirebaseInitƒ(true);
    })();
  });

  if (!firebaseInitƒ) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <FontsProvider>
          <RootNavigator />
        </FontsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
