import { useContext } from 'react';

import { AuthContext } from '../../api/auth/AuthProvider';
import StyledNavigationContainer from '../../styles/StyledNavigationContainer';
import AppNagivator from '../AppStack';
import AuthNavigator from '../AuthStack';

const Routes = () => {
  const { user } = useContext(AuthContext);

  return (
    <StyledNavigationContainer>
      {user ? <AppNagivator /> : <AuthNavigator />}
    </StyledNavigationContainer>
  );
};

export default Routes;
