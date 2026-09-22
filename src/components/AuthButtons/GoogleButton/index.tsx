import {
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { makeStyles } from '@rneui/themed';
import { useContext } from 'react';

import { AuthContext } from 'api/auth/AuthProvider';
import { isFirebaseError } from 'api/types';

const GoogleButton = () => {
  const { googleLogin } = useContext(AuthContext);
  const styles = useStyles();

  const handleLogin = async () => {
    try {
      await googleLogin();
    } catch (error) {
      if (isFirebaseError(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            break;
          default:
            console.error(error);
        }
        return;
      }

      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        (error.code === statusCodes.SIGN_IN_CANCELLED ||
          error.code === statusCodes.IN_PROGRESS ||
          error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE)
      ) {
        return;
      }

      console.error(error);
    }
  };

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Light}
      onPress={handleLogin}
      style={styles.googleButton}
    />
  );
};

const useStyles = makeStyles(() => ({
  googleButton: {
    width: '100%',
    height: 54,
  },
}));

export default GoogleButton;
