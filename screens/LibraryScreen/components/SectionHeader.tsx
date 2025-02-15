import { makeStyles } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

import Icon from 'components/Icon';
import Text from 'components/Text';

import { translations } from 'locales/translations';

import { SECTIONS_IDS } from '../hooks';

type SectionHeaderProps = {
  id: string;
  title: string;
  handleAddBook: () => void;
};

export const SectionHeader = ({
  id,
  title,
  handleAddBook,
}: SectionHeaderProps) => {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <View style={styles.headerContainer}>
      <Text text={title} kind="header" />
      {id === SECTIONS_IDS.CURRENT && (
        <TouchableOpacity style={styles.text} onPress={handleAddBook}>
          <Icon icon="plus" color="grey" />
          <Text
            kind="paragraph"
            text={t(translations.library.searchTitle)}
            color="grey"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const useStyles = makeStyles(() => ({
  headerContainer: {
    gap: 20,
  },
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  text: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderStyle: 'dashed',
    alignItems: 'center',
    borderColor: 'grey',
  },
}));
