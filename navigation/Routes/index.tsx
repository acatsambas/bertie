import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StyledNavigationContainer from "../../styles/StyledNavigationContainer";

import AuthNavigator from "../AuthStack";

import { AuthNavigatorParamList } from "../AuthStack/params";

const Stack = createNativeStackNavigator<AuthNavigatorParamList>();

const Routes = () => {
  return (
    <StyledNavigationContainer>
      <AuthNavigator />
    </StyledNavigationContainer>
  );
};

export default Routes;
