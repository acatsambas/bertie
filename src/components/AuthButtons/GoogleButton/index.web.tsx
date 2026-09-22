import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { AuthContext } from 'api/auth/AuthProvider';
import { isFirebaseError } from 'api/types';
import Button from 'components/Button';
import { translations } from 'locales/translations';

import googleG from './assets/google-g.png';

const GoogleButton = () => {
  const { googleLogin } = useContext(AuthContext);
  const { t } = useTranslation();

  const handleLogin = async () => {
    try {
      await googleLogin();
    } catch (error) {
      if (
        isFirebaseError(error) &&
        (error.code === 'auth/popup-closed-by-user' ||
          error.code === 'auth/cancelled-popup-request')
      ) {
        return;
      }
      console.error(error);
    }
  };

  return (
    <Button
      kind="tertiary"
      iconImage={googleG}
      text={t(translations.welcome.google)}
      onPress={handleLogin}
    />
  );
};

export default GoogleButton;
