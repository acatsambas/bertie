import { useState } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { makeStyles } from "@rneui/themed";
import { Tab } from "@rneui/themed";

import { AppNavigatorParamList } from "../../navigation/AppStack/params";
import { translations } from "../../locales/translations";
import Text from "../../components/Text";
import BottomMenu from "../../components/BottomMenu";
import Avatar from "../../components/Avatar";
import BookshopsList from "../../components/BookshopsList"; // Assuming you have a BookshopsList component
import DiscoverRecommendedBooks from "../../components/DiscoverRecommendedBooks"; // Importing DiscoverRecommendedBooks

export interface DiscoverScreenProps
  extends StackNavigationProp<AppNavigatorParamList, "DiscoverNavigator"> {}

const DiscoverScreen = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { navigate } = useNavigation<DiscoverScreenProps>();

  const [index, setIndex] = useState(0);

  const handleAvatarClick = () => {
    navigate("SettingsNavigator");
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text text={t(translations.discover.title)} kind="bigHeader" />
          <Avatar onPress={handleAvatarClick} />
        </View>
        <Tab
          value={index}
          onChange={setIndex}
          titleStyle={{ fontFamily: "Goudy Bookletter 1911", fontSize: 24 }}
        >
          <Tab.Item>{t(translations.discover.bookshops)}</Tab.Item>
          <Tab.Item>{t(translations.discover.books)}</Tab.Item>
        </Tab>
        {index === 0 ? (
          <View style={styles.bookshopContainer}>
            <View style={styles.description}>
              <Text
                text={t(translations.discover.description)}
                kind="paragraph"
              />
            </View>
            <BookshopsList />
          </View>
        ) : (
          <View style={styles.booksTab}>
            <Text text={t(translations.discover.booksHeader)} kind="paragraph" />
            <DiscoverRecommendedBooks />
          </View>
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
    backgroundColor: "#FDF9F6",
    position: "relative",
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
  bottomArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
  },
  booksTab: {
    gap: 20,
  },
}));

export default DiscoverScreen;
