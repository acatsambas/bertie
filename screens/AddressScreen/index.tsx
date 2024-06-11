import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { makeStyles } from "@rneui/themed";

import { translations } from "../../locales/translations";
import Text from "../../components/Text";
import Input from "../../components/Input";
import Button from "../../components/Button";

const AddressScreen = () => {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Text text={t(translations.settings.address.title)} kind="header" />
        <Text
          text={t(translations.settings.address.description)}
          kind="paragraph"
        />
        <View>
          <Input placeholder={t(translations.settings.address.addr1)} />
          <Input placeholder={t(translations.settings.address.addr2)} />
          <Input placeholder={t(translations.settings.address.city)} />
          <Input placeholder={t(translations.settings.address.postcode)} />
          <Input placeholder={t(translations.settings.address.country)} />
        </View>
      </View>
      <View style={styles.bottomArea}>
        <Button kind="primary" text={t(translations.settings.address.button)} />
      </View>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(() => ({
  safeAreaView: {
    flex: 1,
    gap: 20,
    paddingHorizontal: 20,
  },
  container: { paddingTop: 20, gap: 20 },
  bottomArea: { flex: 1, justifyContent: "flex-end", marginBottom: 20 },
}));

export default AddressScreen;
