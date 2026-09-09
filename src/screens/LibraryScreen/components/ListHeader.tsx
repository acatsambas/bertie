import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import Avatar from 'components/Avatar';
import Text from 'components/Text';

import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

import { translations } from 'locales/translations';

export interface LibraryScreenProps
  extends StackNavigationProp<
    NavigationType,
    typeof Routes.LIBRARY_01_LIBRARY
  > {}

export const ListHeader = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation<LibraryScreenProps>();

  const handleAvatarClick = () => {
    navigate(Routes.APP_02_SETTINGS);
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
    // Matches the header on Discover: the screen container carries no
    // horizontal padding of its own (so the Tab bar below spans edge to
    // edge), so this supplies its own gutter along with the top/bottom
    // spacing it needs now that it sits fixed above the tab bar rather
    // than scrolling as a list header.
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
});

export default ListHeader;
