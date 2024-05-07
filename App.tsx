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
      <Fonts>
        <Routes />
      </Fonts>
    </ThemeProvider>
  );
};

export default App;
