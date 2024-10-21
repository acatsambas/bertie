import { useTranslation } from 'react-i18next';

import { translations } from '../../locales/translations';
import Text from '../Text';

const Logo = () => {
  const { t } = useTranslation();
  return <Text text={t(translations.appName)} kind="bigHeader" />;
};

export default Logo;
