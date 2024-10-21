import './locales/i18n';

import { ThemeProvider, createTheme } from '@rneui/themed';
import { AuthProvider } from './api/auth/AuthProvider';

import Routes from './navigation/Routes';
import { FontsProvider } from './styles/FontsProvider';

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
