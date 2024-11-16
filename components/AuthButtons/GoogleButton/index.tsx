import {
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { makeStyles } from '@rneui/themed';
import { useContext } from 'react';

import { AuthContext } from '../../../api/auth/AuthProvider';
import { isFirebaseError } from '../../../api/types';

/* https://github.com/chelseafarley/expo-google-signin/blob/main/App.js */

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
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            break;
          default:
            // some other error happened
            console.error(error);
        }
      }
    }
  };

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Light}
      onPress={handleLogin}
      style={styles.appleButton}
    />
  );
};

const useStyles = makeStyles(() => ({
  appleButton: {
    width: '100%',
    height: 54,
  },
}));

export default GoogleButton;
