import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { ThemeProvider, createTheme } from "@rneui/themed";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Routes from "./navigation/Routes";

const theme = createTheme({
  lightColors: {
    primary: "#565EAF",
    secondary: "white",
  },
  mode: "light",
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider style={styles.container}>
        <Routes />
        {/* <StatusBar style="auto" /> */}
      </SafeAreaProvider>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
