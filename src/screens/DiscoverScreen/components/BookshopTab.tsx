import { useNavigation } from '@react-navigation/native';
import { makeStyles } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import AddressNeededNotice from 'components/AddressNeededNotice';
import BookshopsList from 'components/BookshopsList';
import { translations } from 'locales/translations';
import { Routes } from 'navigation/routes';
import { DiscoverScreenProps } from 'screens/DiscoverScreen';

export const BookshopTab = ({ user }) => {
  const { navigate } = useNavigation<DiscoverScreenProps>();
  const { t } = useTranslation();
  const styles = useStyles();

  return (
    <View style={styles.bookshopContainer}>
      {!user?.address ? (
        <AddressNeededNotice
          title={t(translations.discover.addressNeededTitle)}
          description={t(translations.discover.addressNeededDescription)}
          actionLabel={t(translations.discover.addressNeededAction)}
          onPress={() => navigate(Routes.DISCOVER_02_ADDRESS)}
        />
      ) : null}
      <BookshopsList />
    </View>
  );
};

const useStyles = makeStyles(() => ({
  // Same gutter as Books / Insights / Order tabs (empty plate + filled list).
  bookshopContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 16,
  },
}));
