import { makeStyles } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from 'components/Button';
import Input from 'components/Input';
import Text from 'components/Text';

import { useUpdateAddressMutation, useUserQuery } from 'api/app/user';

import { translations } from 'locales/translations';

export const AddressScreen = ({ navigation }) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { data: user } = useUserQuery();
  const updateAddress = useUpdateAddressMutation();
  const [address, setAddress] = useState<typeof user.address>({
    firstLine: '',
    secondLine: '',
    city: '',
    postcode: '',
    country: '',
  });
  const [componentMounted, setComponentMounted] = useState(false);

  useEffect(() => {
    if (user && user?.address && !componentMounted) {
      setAddress(user.address);
      setComponentMounted(true);
    }
  }, [componentMounted, user]);

  const handleSave = async () => {
    if (!address.postcode.trim() || !user) {
      Alert.alert(
        t(translations.settings.address.validationTitle),
        t(translations.settings.address.validationMessage),
      );
      return;
    }

    await updateAddress.mutateAsync({ address });

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text text={t(translations.settings.address.title)} kind="header" />
        <Text
          text={t(translations.settings.address.description)}
          kind="paragraph"
        />
        <Input
          marginTop={0}
          placeholder={t(translations.settings.address.addr1)}
          onChangeText={text => setAddress({ ...address, firstLine: text })}
          value={address?.firstLine}
        />
        <Input
          marginTop={0}
          placeholder={t(translations.settings.address.addr2)}
          onChangeText={text => setAddress({ ...address, secondLine: text })}
          value={address?.secondLine}
        />
        <Input
          marginTop={0}
          placeholder={t(translations.settings.address.city)}
          onChangeText={text => setAddress({ ...address, city: text })}
          value={address?.city}
        />
        <Input
          marginTop={0}
          placeholder={t(translations.settings.address.postcode)}
          onChangeText={text => setAddress({ ...address, postcode: text })}
          value={address?.postcode}
        />
        <Input
          marginTop={0}
          placeholder={t(translations.settings.address.country)}
          onChangeText={text => setAddress({ ...address, country: text })}
          value={address?.country}
        />
      </ScrollView>
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
  container: { paddingTop: 16, gap: 8 },
  bottomArea: { position: 'relative', marginBottom: 20 },
}));
