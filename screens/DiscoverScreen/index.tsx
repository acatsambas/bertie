import { useState } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { makeStyles } from "@rneui/themed";

import { AppNavigatorParamList } from "../../navigation/AppStack/params";
import { translations } from "../../locales/translations";
import Text from "../../components/Text";
import BottomMenu from "../../components/BottomMenu";
import BookShop from "../../components/Bookshop";
import Avatar from "../../components/Avatar";

export interface DiscoverScreenProps
  extends StackNavigationProp<AppNavigatorParamList, "Discover"> {}

const DiscoverScreen = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { navigate } = useNavigation<DiscoverScreenProps>();

  const [tab, setTab] = useState("Bookshops");

  const handleAvatarClick = () => {
    navigate("Settings");
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text text={t(translations.discover.title)} kind="bigHeader" />
          <Avatar onPress={handleAvatarClick} />
        </View>
        <View style={styles.tabs}>
          <Text
            text={t(translations.discover.bookshops)}
            kind="header"
            onPress={() => setTab("Bookshops")}
          />
          <Text
            text={t(translations.discover.books)}
            kind="header"
            onPress={() => setTab("Books")}
          />
        </View>
        {tab === "Bookshops" ? (
          <View style={styles.bookshopContainer}>
            <View style={styles.description}>
              <Text
                text={t(translations.discover.description)}
                kind="paragraph"
              />
            </View>
            <View style={styles.bookshops}>
              <BookShop name="Daunt Books" location="London" kind="default" />
              <BookShop
                name="John Sandoe Books"
                location="London"
                kind="default"
              />
            </View>
          </View>
        ) : (
          <View></View>
        )}
      </View>
      <View style={styles.bottomArea}>
        <BottomMenu />
      </View>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(() => ({
  safeAreaView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  container: { paddingTop: 20, gap: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  bookshopContainer: {
    gap: 20,
  },
  description: {
    backgroundColor: "#F3EAFF",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  bookshops: {
    overflow: "hidden",
  },
  bottomArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
}));

export default DiscoverScreen;
