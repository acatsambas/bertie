import firestore from '@react-native-firebase/firestore';
import { makeStyles } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from 'components/Button';
import Input from 'components/Input';
import Text from 'components/Text';

import { useUser } from 'api/app/hooks';

import { translations } from 'locales/translations';

const AddressScreen = ({ navigation }) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const user = useUser();
  const [address, setAddress] = useState<typeof user.address>({
    firstLine: '',
    secondLine: '',
    city: '',
    postcode: '',
    country: '',
  });
  const [componentMounted, setComponentMounted] = useState(false);

  useEffect(() => {
    if (user?.address && !componentMounted) {
      setAddress(user.address);
      setComponentMounted(true);
    }
  }, [componentMounted, user]);

  const handleSave = async () => {
    if (!address.postcode.trim()) {
      Alert.alert(
        t(translations.settings.address.validationTitle),
        t(translations.settings.address.validationMessage),
      );
      return;
    }

    await firestore().collection('users').doc(user.documentId).update({
      address,
    });

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Text text={t(translations.settings.address.title)} kind="header" />
        <Text
          text={t(translations.settings.address.description)}
          kind="paragraph"
        />
        <View>
          <Input
            placeholder={t(translations.settings.address.addr1)}
            onChangeText={text => setAddress({ ...address, firstLine: text })}
            value={address?.firstLine}
          />
          <Input
            placeholder={t(translations.settings.address.addr2)}
            onChangeText={text => setAddress({ ...address, secondLine: text })}
            value={address?.secondLine}
          />
          <Input
            placeholder={t(translations.settings.address.city)}
            onChangeText={text => setAddress({ ...address, city: text })}
            value={address?.city}
          />
          <Input
            placeholder={t(translations.settings.address.postcode)}
            onChangeText={text => setAddress({ ...address, postcode: text })}
            value={address?.postcode}
          />
          <Input
            placeholder={t(translations.settings.address.country)}
            onChangeText={text => setAddress({ ...address, country: text })}
            value={address?.country}
          />
        </View>
      </View>

      <View style={styles.bottomArea}>
        <Button
          kind="primary"
          text={t(translations.settings.address.button)}
          onPress={handleSave}
        />
      </View>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(theme => ({
  safeAreaView: {
    flex: 1,
    gap: 20,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.white,
  },
  container: { paddingTop: 20, gap: 20 },
  bottomArea: { flex: 1, justifyContent: 'flex-end', marginBottom: 20 },
}));

export default AddressScreen;
