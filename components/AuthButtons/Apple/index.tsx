import { makeStyles } from '@rneui/themed';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useContext } from 'react';

import { AuthContext } from '../../../api/auth/AuthProvider';
import { isFirebaseError } from '../../../api/types';

const AppleSigninButton = () => {
  const styles = useStyles();

  const { appleLogin } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      await appleLogin();
    } catch (error) {
      if (isFirebaseError(error)) {
        console.error(error);
      }
    }
  };

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      style={styles.appleButton}
      cornerRadius={5}
      onPress={handleLogin}
    />
  );
};

const useStyles = makeStyles(() => ({
  appleButton: {
    width: '100%',
    height: 54,
  },
}));

export default AppleSigninButton;
