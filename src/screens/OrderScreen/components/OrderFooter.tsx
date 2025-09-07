import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import Button from 'components/Button';
import Text from 'components/Text';

import { translations } from 'locales/translations';

interface OrderFooterProps {
  loading: boolean;
  hasBooks: boolean;
  onNext: () => void;
}

export const OrderFooter = ({
  loading,
  hasBooks,
  onNext,
}: OrderFooterProps) => {
  const { t } = useTranslation();

  if (loading || !hasBooks) return null;

  return (
    <View style={{ paddingTop: 20, paddingBottom: 20 }}>
      <Text text={t(translations.order.details)} kind="header" />
      <View style={{ marginBottom: 20 }}>
        <Text text={`\u2022 First Name`} kind="description" />
        <Text text={`\u2022 Last Name`} kind="description" />
        <Text text={`\u2022 Email`} kind="description" />
        <Text text={`\u2022 Address`} kind="description" />
      </View>
      <Button
        kind="primary"
        text={t(translations.order.next)}
        onPress={onNext}
      />
    </View>
  );
};
