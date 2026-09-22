import { useRoute } from '@react-navigation/native';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { AuthContext } from 'api/auth/AuthProvider';
import Button from 'components/Button';
import Text from 'components/Text';
import { translations } from 'locales/translations';
import { goBackOrFallback } from 'navigation/goBackOrFallback';
import {
  SettingsFormError,
  SettingsFormIntro,
} from 'screens/SettingsScreen/SettingsForm';
import { SettingsPageShell } from 'screens/SettingsScreen/SettingsPageShell';

import { BegoneConfirm } from './BegoneConfirm';

const DeleteScreen = ({
  navigation,
}: {
  navigation: NavigationProp<ParamListBase>;
}) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const styles = useStyles();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { user } = useContext(AuthContext);
  const route = useRoute();

  const phrase = t(translations.delete.begone);
  const matched = inputValue === phrase;

  const handleInput = (value: string) => {
    setInputValue(value);
    setErrorKey(null);
  };

  const handleDelete = () => {
    if (!matched) {
      setErrorKey(translations.delete.errors.mismatch);
      return;
    }
    setIsDeleted(true);
  };

  const handleDone = () => {
    void user?.delete();
  };

  return (
    <SettingsPageShell
      title={t(translations.delete.title)}
      onBack={() => goBackOrFallback(navigation, route.name)}
      footer={
        !isDeleted ? (
          <Button
            text={t(translations.delete.button)}
            kind={matched ? 'primary' : 'tertiary'}
            onPress={handleDelete}
          />
        ) : (
          <Button
            text={t(translations.delete.done)}
            kind="primary"
            onPress={handleDone}
          />
        )
      }
    >
      {!isDeleted ? (
        <>
          <SettingsFormIntro text={t(translations.delete.paragraph1)} />
          <Text
            kind="description"
            text={t(translations.delete.consequence)}
            color={theme.colors.grey2}
          />
          <BegoneConfirm
            phrase={phrase}
            value={inputValue}
            placeholder={t(translations.delete.confirmHint)}
            matched={matched}
            onChangeText={handleInput}
          />
          {errorKey ? <SettingsFormError text={t(errorKey)} /> : null}
        </>
      ) : (
        <View style={styles.farewell}>
          <Text
            kind="header"
            text={t(translations.delete.farewellTitle)}
            color={theme.colors.secondary}
          />
          <Text
            kind="paragraph"
            text={t(translations.delete.finalMessage)}
            color={theme.colors.grey2}
          />
        </View>
      )}
    </SettingsPageShell>
  );
};

const useStyles = makeStyles({
  farewell: {
    gap: 12,
    paddingTop: 8,
  },
});

export default DeleteScreen;
