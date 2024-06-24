import { View } from "react-native";
import BookShop from "../Bookshop";

const BookshopsList = () => {
  return (
    <View>
      <BookShop name="Daunt Books" location="London" kind="default" />
      <BookShop name="John Sandoe Books" location="London" kind="default" />
    </View>
  );
};

export default BookshopsList;
