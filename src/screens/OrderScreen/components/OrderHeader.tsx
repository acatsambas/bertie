import React from 'react';
import { useTranslation } from 'react-i18next';

import Text from 'components/Text';

import { translations } from 'locales/translations';

export const OrderHeader = ({ hasBooks }: { hasBooks: boolean }) => {
  const { t } = useTranslation();
  if (!hasBooks) return null;
  return (
    <>
      <Text text={t(translations.order.title)} kind="bigHeader" />
      <Text text={t(translations.order.header)} kind="header" />
    </>
  );
};
