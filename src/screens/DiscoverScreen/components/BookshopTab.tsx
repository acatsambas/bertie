import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import BookshopsList from 'components/BookshopsList';
import Text from 'components/Text';

import { Routes } from 'navigation/routes';

import { DiscoverScreenProps } from 'screens/DiscoverScreen';

import { translations } from 'locales/translations';

export const BookshopTab = ({ user }) => {
  const { navigate } = useNavigation<DiscoverScreenProps>();
  const { t } = useTranslation();

  return (
    <View style={styles.bookshopContainer}>
      {!user?.address && (
        <View style={styles.description}>
          <Text
            text={t(translations.discover.description)}
            kind="paragraph"
            onPress={() => navigate(Routes.SETTINGS_02_CHANGE_ADDRESS)}
          />
        </View>
      )}
      <BookshopsList />
    </View>
  );
};

const styles = StyleSheet.create({
  bookshopContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  description: {
    backgroundColor: '#F3EAFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
