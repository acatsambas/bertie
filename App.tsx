import { SafeAreaProvider } from "react-native-safe-area-context";

import { ThemeProvider, createTheme } from "@rneui/themed";

import Routes from "./navigation/Routes";
import Fonts from "./components/Fonts";

const theme = createTheme({
  lightColors: {
    primary: "#565EAF",
    secondary: "#222222",
  },
  mode: "light",
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <Fonts>
          <Routes />
        </Fonts>
      </SafeAreaProvider>
    </ThemeProvider>
  );
};

export default App;
