import firestore from '@react-native-firebase/firestore';
import { makeStyles } from '@rneui/themed';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useUser } from '../../api/app/hooks';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Text from '../../components/Text';
import { translations } from '../../locales/translations';

const EmailScreen = ({ navigation }) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const user = useUser();
  const [email, setEmail] = useState('');
  const [checkEmail, setCheckEmail] = useState('');
  const [error, setError] = useState(false);

  const handleMailInput = (text: string) => {
    setEmail(text);
    setError(false);
  };
  const handleMailCheckInput = (text: string) => {
    setCheckEmail(text);
    setError(false);
  };

  const handleSave = async () => {
    const validRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (email === checkEmail && email.match(validRegex)) {
      await firestore().collection('users').doc(user.documentId).update({
        email,
      });

      navigation.goBack();
      console.log('totu bine');
    } else {
      setError(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Text text={t(translations.order.emailTitle)} kind="header" />
        <Text text={t(translations.order.email)} kind="paragraph" />
        <View>
          <Input
            placeholder={t(translations.order.emailPlaceholder)}
            onChangeText={handleMailInput}
            value={email}
          />
          <Input
            placeholder={t(translations.order.emailConfirmPh)}
            onChangeText={handleMailCheckInput}
            value={checkEmail}
          />
        </View>
      </View>
      {error && (
        <View style={styles.error}>
          <Text kind="paragraph" text={t(translations.order.mailError)} />
        </View>
      )}

      <View style={styles.bottomArea}>
        <Button
          kind="primary"
          text={t(translations.settings.address.button)}
          onPress={handleSave}
        />
      </View>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(theme => ({
  safeAreaView: {
    flex: 1,
    gap: 20,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.white,
  },
  container: { paddingTop: 20, gap: 20 },
  error: {
    backgroundColor: '#FDEDED',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  bottomArea: { flex: 1, justifyContent: 'flex-end', marginBottom: 20 },
}));

export default EmailScreen;
