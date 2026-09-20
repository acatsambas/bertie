import { makeStyles } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import Button from 'components/Button';
import Text from 'components/Text';
import { translations } from 'locales/translations';

interface OrderFooterProps {
  hasBooks: boolean;
  onNext: () => void;
}

export const OrderFooter = ({ hasBooks, onNext }: OrderFooterProps) => {
  const { t } = useTranslation();
  const styles = useStyles();

  if (!hasBooks) return null;

  return (
    <View style={styles.dock}>
      <Text text={t(translations.order.details)} kind="description" />
      <Button
        kind="primary"
        text={t(translations.order.next)}
        onPress={onNext}
      />
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  dock: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.grey0,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 12,
  },
}));
