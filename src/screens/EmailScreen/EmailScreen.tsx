import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import { makeStyles } from '@rneui/themed';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useUpdateContactEmailMutation, useUserQuery } from 'api/app/user';
import { BackTitleHeader } from 'components/BackTitleHeader';
import Button from 'components/Button';
import Input from 'components/Input';
import Text from 'components/Text';
import { translations } from 'locales/translations';
import { goBackOrFallback } from 'navigation/goBackOrFallback';
import { Routes } from 'navigation/routes';

export const EmailScreen = ({
  navigation,
}: {
  navigation: NavigationProp<ParamListBase>;
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { data: user } = useUserQuery();
  const updateContactEmail = useUpdateContactEmailMutation();
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
    const validRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (email === checkEmail && email.match(validRegex) && user) {
      await updateContactEmail.mutateAsync({ contactEmail: email });

      navigation.goBack();
    } else {
      setError(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <BackTitleHeader
          title={t(translations.order.emailTitle)}
          onBack={() =>
            goBackOrFallback(navigation, Routes.ORDER_05_EMAIL_SCREEN)
          }
        />
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
