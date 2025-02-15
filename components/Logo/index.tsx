import { useTranslation } from 'react-i18next';

import Text from 'components/Text';

import { translations } from 'locales/translations';

const Logo = () => {
  const { t } = useTranslation();
  return <Text text={t(translations.appName)} kind="bigHeader" />;
};

export default Logo;
