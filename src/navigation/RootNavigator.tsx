import { useContext } from 'react';

import { AuthContext } from 'api/auth/AuthProvider';

import StyledNavigationContainer from 'styles/StyledNavigationContainer';

import AppNavigator from './navigators/AppNavigator';
import AuthNavigator from './navigators/AuthNavigator';

const RootNavigator = () => {
  const { user } = useContext(AuthContext);

  return (
    <StyledNavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </StyledNavigationContainer>
  );
};

export default RootNavigator;
