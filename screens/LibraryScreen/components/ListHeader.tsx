import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import Avatar from 'components/Avatar';
import Text from 'components/Text';

import { AppNavigatorParamList } from 'navigation/AppStack/params';

import { translations } from 'locales/translations';

export interface LibraryScreenProps
  extends StackNavigationProp<AppNavigatorParamList, 'LibraryNavigator'> {}

export const ListHeader = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation<LibraryScreenProps>();

  const handleAvatarClick = () => {
    navigate('SettingsNavigator');
  };

  return (
    <View style={styles.header}>
      <Text text={t(translations.library.title)} kind="bigHeader" />
      <Avatar onPress={handleAvatarClick} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ListHeader;
