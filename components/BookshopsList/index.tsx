import { useEffect, useState } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import firestore from "@react-native-firebase/firestore";

import {
  DiscoverNavigatorParamList,
  BookshopType,
} from "../../navigation/AppStack/params";
import BookShop from "../Bookshop";

export interface DiscoverPageProps
  extends StackNavigationProp<DiscoverNavigatorParamList, "Discover"> {}

const BookshopsList = () => {
  const [bookshops, setBookshops] = useState([]);
  useEffect(() => {
    fetchBookshops();
  }, []);

  const fetchBookshops = async () => {
    const bookShopsSnapshot = await firestore().collection("shops").get();
    const bookShopsList = bookShopsSnapshot.docs.map((doc) => ({
      bookId: doc.id,
      ...doc.data(),
    }));
    setBookshops(bookShopsList);
  };

  const { navigate } = useNavigation<DiscoverPageProps>();

  const handleBookshop = (bookshop: BookshopType) => {
    navigate("Bookshop", bookshop);
  };

  return (
    <View>
      {bookshops.map((bookshop) => (
        <BookShop
          key={bookshop.id}
          name={bookshop.name}
          location={bookshop.city}
          kind="default"
          onPress={() => handleBookshop(bookshop)}
        />
      ))}
    </View>
  );
};

export default BookshopsList;
