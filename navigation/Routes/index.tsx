import { useContext } from "react";

import StyledNavigationContainer from "../../styles/StyledNavigationContainer";
import { AuthContext } from "../../api/auth/AuthProvider";

import AuthNavigator from "../AuthStack";
import AppNagivator from "../AppStack";

const Routes = () => {
  const { user } = useContext(AuthContext);

  return (
    <StyledNavigationContainer>
      {user ? <AppNagivator /> : <AuthNavigator />}
    </StyledNavigationContainer>
  );
};

export default Routes;
