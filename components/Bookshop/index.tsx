import { TouchableOpacity, View } from "react-native";

import { makeStyles } from "@rneui/themed";

import Text from "../../components/Text";
import Icon from "../Icon";

interface BookShopProps {
  kind?: "default" | "favorite" | "favoriteSelected";
  name: string;
  location: string;
}

const BookShop = ({ kind, name, location }: BookShopProps) => {
  const styles = useStyles();

  const handlePress = () => {
    //TODO: Handle press when clicking on Bookshop
  };
  return (
    <TouchableOpacity
      style={kind === "favoriteSelected" ? styles.fav : styles.container}
      onPress={handlePress}
    >
      <View>
        <Text text={name} kind="paragraph" />
        <Text text={location} kind="littleText" />
      </View>
      {kind === "default" && <Icon icon="right" />}
    </TouchableOpacity>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: "100%",
    padding: 20,
    gap: 20,
    justifyContent: "space-between",
  },
  fav: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: "100%",
    borderWidth: 1,
    borderRadius: 5,
    padding: 20,
    gap: 20,
    justifyContent: "space-between",
  },
}));

export default BookShop;
