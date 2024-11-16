import { makeStyles } from '@rneui/themed';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthContext } from '../../api/auth/AuthProvider';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Text from '../../components/Text';
import { translations } from '../../locales/translations';

const DeleteScreen = () => {
  const [isDeleted, setIsDeleted] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const styles = useStyles();
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

  const handleInput = (value: string) => {
    setInputValue(value);
  };

  const handleDelete = () => {
    if (inputValue === 'begone!') {
      setIsDeleted(true);
    } else {
      setError("You didn't write well the word 'begone!'");
    }
  };

  const handleDone = () => {
    user.delete();
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Text text={t(translations.delete.title)} kind="header" />
        {!isDeleted ? (
          <>
            <Text text={t(translations.delete.paragraph1)} kind="paragraph" />
            <Text text={t(translations.delete.paragraph2)} kind="paragraph" />
            <Input
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              onChangeText={handleInput}
              placeholder="begone!"
              value={inputValue}
            />
            {error && (
              <View style={styles.error}>
                <Text text={error} kind="paragraph" />
              </View>
            )}
          </>
        ) : (
          <Text text={t(translations.delete.finalMessage)} kind="paragraph" />
        )}
      </View>
      <View style={styles.bottomArea}>
        {!isDeleted ? (
          <Button
            text={t(translations.delete.button)}
            kind="primary"
            onPress={handleDelete}
          />
        ) : (
          <Button
            text={t(translations.delete.done)}
            kind="primary"
            onPress={handleDone}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(theme => ({
  safeAreaView: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.white,
  },
  container: { paddingTop: 20, gap: 20 },
  error: {
    backgroundColor: '#FDEDED',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  bottomArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
}));

export default DeleteScreen;
