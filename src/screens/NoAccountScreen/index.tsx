import { makeStyles } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { Platform, View } from 'react-native';

import AppleSigninButton from 'components/AuthButtons/Apple';
import GoogleButton from 'components/AuthButtons/GoogleButton';
import AuthPageShell from 'components/AuthPageShell';
import { BackTitleHeader } from 'components/BackTitleHeader';
import Button from 'components/Button';
import Text from 'components/Text';
import { translations } from 'locales/translations';

const NoAccountScreen = ({ navigation }) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLogin = () => {};

  return (
    <AuthPageShell>
      <View style={styles.container}>
        <BackTitleHeader
          title={t(translations.noAccount.title)}
          onBack={handleBack}
        />
        <Text kind="paragraph" text={t(translations.noAccount.paragraph)} />
        <View style={styles.buttons}>
          <Button
            kind="primary"
            icon="email"
            text={t(translations.welcome.email)}
            onPress={handleLogin}
          />
          <GoogleButton />
          {Platform.OS === 'ios' && <AppleSigninButton />}
        </View>
      </View>
    </AuthPageShell>
  );
};

const useStyles = makeStyles(() => ({
  container: { paddingTop: 20, gap: 20 },
  buttons: {
    gap: 12,
  },
}));

export default NoAccountScreen;
