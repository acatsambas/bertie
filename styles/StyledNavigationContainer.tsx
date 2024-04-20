import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

const StyledNavigationContainer = ({ children }) => {
  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>{children}</NavigationContainer>
    </>
  );
};

export default StyledNavigationContainer;
