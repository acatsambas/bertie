import { makeStyles } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';

import Icon from 'components/Icon';
import Text from 'components/Text';

import { translations } from 'locales/translations';

/**
 * The dashed "Search for a book" row. It used to live inside the Current
 * section header of the single combined list; now that Current and Past are
 * tabs, it heads the Current list — a book you add starts out unread, so it
 * has no place above the Past list.
 */
export const AddBookButton = ({ onPress }: { onPress: () => void }) => {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Icon icon="plus" color="grey" />
      <Text
        kind="paragraph"
        text={t(translations.library.searchTitle)}
        color="grey"
      />
    </TouchableOpacity>
  );
};

const useStyles = makeStyles(() => ({
  button: {
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

export default AddBookButton;
