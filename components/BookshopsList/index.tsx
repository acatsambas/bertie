import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import BookShop from "../Bookshop";
import { DiscoverNavigatorParamList } from "../../navigation/AppStack/params";

export interface DiscoverPageProps
  extends StackNavigationProp<DiscoverNavigatorParamList, "Discover"> {}

const BookshopsList = () => {
  const { navigate } = useNavigation<DiscoverPageProps>();

  const handleBookshop = (bookshopName: string) => {
    navigate("Bookshop", { bookshopName: bookshopName });
  };

  return (
    <View>
      <BookShop
        name="Daunt Books"
        location="London"
        kind="default"
        onPress={() => handleBookshop("Daunt Books")}
      />
      <BookShop name="John Sandoe Books" location="London" kind="default" />
    </View>
  );
};

export default BookshopsList;
