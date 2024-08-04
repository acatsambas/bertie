import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import firestore from "@react-native-firebase/firestore";

import { makeStyles } from "@rneui/themed";

import { AuthContext } from "../../api/auth/AuthProvider";
import { translations } from "../../locales/translations";
import Text from "../../components/Text";
import Input from "../../components/Input";
import Button from "../../components/Button";

const AddressScreen = () => {
  const [addr1, setAddr1] = useState("");
  const [addr2, setAddr2] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("");

  const { user } = useContext(AuthContext);
  const userId = user.uid;

  useEffect(() => {
    fetchAddress();
  }, []);

  const fetchAddress = async () => {
    const userAddress = await firestore()
      .collection("Address")
      .doc(userId)
      .get();
    setAddr1(userAddress.data().addr1);
    setAddr2(userAddress.data().addr2);
    setCity(userAddress.data().city);
    setPostcode(userAddress.data().postcode);
    setCountry(userAddress.data().country);
  };

  const styles = useStyles();
  const { t } = useTranslation();

  const handleAddr1 = (value: string) => {
    setAddr1(value);
  };
  const handleAddr2 = (value: string) => {
    setAddr2(value);
  };
  const handleCity = (value: string) => {
    setCity(value);
  };
  const handlePostcode = (value: string) => {
    setPostcode(value);
  };
  const handleCountry = (value: string) => {
    setCountry(value);
  };
  const handleSave = async () => {
    try {
      await firestore().collection("Address").doc(userId).set(
        {
          addr1: addr1,
          addr2: addr2,
          city: city,
          postcode: postcode,
          country: country,
        },
        { merge: true }
      );
    } catch (error) {
      console.log(error);
    }
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
            onChangeText={handleAddr1}
            value={addr1}
          />
          <Input
            placeholder={t(translations.settings.address.addr2)}
            onChangeText={handleAddr2}
            value={addr2}
          />
          <Input
            placeholder={t(translations.settings.address.city)}
            onChangeText={handleCity}
            value={city}
          />
          <Input
            placeholder={t(translations.settings.address.postcode)}
            onChangeText={handlePostcode}
            value={postcode}
          />
          <Input
            placeholder={t(translations.settings.address.country)}
            onChangeText={handleCountry}
            value={country}
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

const useStyles = makeStyles(() => ({
  safeAreaView: {
    flex: 1,
    gap: 20,
    paddingHorizontal: 20,
    backgroundColor: "#FDF9F6",
  },
  container: { paddingTop: 20, gap: 20 },
  bottomArea: { flex: 1, justifyContent: "flex-end", marginBottom: 20 },
}));

export default AddressScreen;
