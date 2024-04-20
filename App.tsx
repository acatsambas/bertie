import { ThemeProvider, createTheme } from "@rneui/themed";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Routes from "./navigation/Routes";

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
        <Routes />
      </SafeAreaProvider>
    </ThemeProvider>
  );
};

export default App;
