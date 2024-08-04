import { RouteProp, useRoute } from "@react-navigation/native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { makeStyles } from "@rneui/themed";

import { DiscoverNavigatorParamList } from "../../navigation/AppStack/params";
import { translations } from "../../locales/translations";
import Text from "../../components/Text";
import Button from "../../components/Button";
import GoogleMaps from "../../components/GoogleMaps";

export interface BookshopPageProps
  extends StackNavigationProp<DiscoverNavigatorParamList, "Bookshop"> {}

const BookshopScreen = () => {
  const { params } =
    useRoute<RouteProp<DiscoverNavigatorParamList, "Bookshop">>();
  const { address, city, country, name, zipcode } = params;
  const styles = useStyles();
  const { t } = useTranslation();
  const { navigate } = useNavigation<BookshopPageProps>();

  const handleBack = () => {
    navigate("Discover");
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <GoogleMaps />
        <View>
          <Text kind="bigHeader" text={name} />
          <Text
            kind="paragraph"
            text={`${address}, ${city} ${zipcode}, ${country}`}
          />
        </View>
        <Button kind="primary" text={t(translations.discover.add)} />
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
