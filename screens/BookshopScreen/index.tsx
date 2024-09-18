import { useContext, useEffect, useState } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import firestore from "@react-native-firebase/firestore";
import RenderHtml from "react-native-render-html";

import { makeStyles } from "@rneui/themed";

import { DiscoverNavigatorParamList } from "../../navigation/AppStack/params";
import { translations } from "../../locales/translations";
import { AuthContext } from "../../api/auth/AuthProvider";
import Text from "../../components/Text";
import Button from "../../components/Button";
import GoogleMaps from "../../components/GoogleMaps";

export interface BookshopPageProps
  extends StackNavigationProp<DiscoverNavigatorParamList, "Bookshop"> {}

const BookshopScreen = () => {
  const [isFav, setIsFav] = useState(false);
  useEffect(() => {
    fetchBook();
  }, []);
  const fetchBook = async () => {
    const bookData = await firestore()
      .collection("users")
      .doc(userId)
      .collection("bookstores")
      .doc(zipcode)
      .get();

    setIsFav(bookData?.data()?.isFav);
  };

  const { user } = useContext(AuthContext);
  const userId = user.uid;

  const { params } =
    useRoute<RouteProp<DiscoverNavigatorParamList, "Bookshop">>();
  const { address, city, country, name, zipcode, description } = params;

  const styles = useStyles();
  const { t } = useTranslation();
  const { navigate } = useNavigation<BookshopPageProps>();

  const handleFavourites = async () => {
    try {
      await firestore()
        .collection("users")
        .doc(userId)
        .collection("bookstores")
        .doc(zipcode)
        .set({ name: name, isFav: !isFav }, { merge: true });
      setIsFav(!isFav);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBack = () => {
    navigate("Discover");
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <GoogleMaps />
        <View>
          <Text kind="bigHeader" text={name} />
          <Text kind="paragraph" text={`${address}, ${city} ${zipcode}`} />
        </View>
        <View>
          <RenderHtml source={{ html: description }} contentWidth={0} />
        </View>
        <Button
          kind="primary"
          text={
            !isFav
              ? t(translations.discover.add)
              : t(translations.discover.remove)
          }
          onPress={handleFavourites}
        />
        <Button
          kind="tertiary"
          text={t(translations.discover.back)}
          onPress={handleBack}
        />
      </View>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(() => ({
  safeAreaView: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#FDF9F6",
  },
  container: { paddingTop: 20, gap: 20 },
}));

export default BookshopScreen;
