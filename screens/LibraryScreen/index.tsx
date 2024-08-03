import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import firestore from "@react-native-firebase/firestore";

import { makeStyles } from "@rneui/themed";

import { AppNavigatorParamList } from "../../navigation/AppStack/params";
import { translations } from "../../locales/translations";
import BottomMenu from "../../components/BottomMenu";
import Text from "../../components/Text";
import Avatar from "../../components/Avatar";
import CurrentBooks from "../../components/CurrentBooks";
import PastBooks from "../../components/PastBooks";

export interface LibraryScreenProps
  extends StackNavigationProp<AppNavigatorParamList, "LibraryNavigator"> {}

const LibraryScreen = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { navigate } = useNavigation<LibraryScreenProps>();

  const handleAvatarClick = () => {
    navigate("SettingsNavigator");
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text text={t(translations.library.title)} kind="bigHeader" />
          <Avatar onPress={handleAvatarClick} />
        </View>
        <CurrentBooks />
        <PastBooks />
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
  bottomArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
}));

export default LibraryScreen;
