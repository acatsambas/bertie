import './locales/i18n';

import { ThemeProvider, createTheme } from '@rneui/themed';

import { initFirebase } from './api/firebase';
import { AuthProvider } from './api/auth/AuthProvider';
import Routes from './navigation/Routes';
import { FontsProvider } from './styles/FontsProvider';
import { useEffect, useState } from 'react';

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
          <Routes />
        </FontsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
