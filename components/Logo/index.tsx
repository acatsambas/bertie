import { Text } from "@rneui/themed";
import { useTranslation } from "react-i18next";
import { translations } from "../../locales/translations";

const Logo = () => {
  const { t } = useTranslation();
  return (
    <Text
      h1
      h1Style={{
        fontSize: 36,
        fontFamily: "Goudy Bookletter 1911",
      }}
    >
      {t(translations.appName)}
    </Text>
  );
};

export default Logo;
