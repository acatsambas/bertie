import { useContext, useState } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { makeStyles } from "@rneui/themed";

import { AuthNavigatorParamList } from "../../navigation/AuthStack/params";
import { AuthContext } from "../../api/auth/AuthProvider";

import Logo from "../../components/Logo";
import Button from "../../components/Button";
import Text from "../../components/Text";
import Input from "../../components/Input";
import { isFirebaseError } from "../../api/types";

export interface SetProfilePageProps
  extends StackNavigationProp<AuthNavigatorParamList, "SetProfile"> {}

const SetProfileScreen = () => {
  const { params } =
    useRoute<RouteProp<AuthNavigatorParamList, "SetProfile">>();

  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [email] = useState(params.email);
  const [password] = useState(params.password);

  const styles = useStyles();
  const { register } = useContext(AuthContext);

  const handleRegister = async () => {
    try {
      await register(email, password, givenName, familyName);
    } catch (error) {
      if (isFirebaseError(error)) {
        console.log(error);
      }
    }
  };

  const handleGivenName = (value: string) => {
    setGivenName(value.trim());
  };

  const handleFamilyName = (value: string) => {
    setFamilyName(value.trim());
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.logo}>
        <Logo />
      </View>

      <View style={styles.container}>
        <Text kind="header" text="Profile" />
        <View>
          <Input
            placeholder="What's your first name?"
            onChangeText={handleGivenName}
          />
          <Input
            placeholder="...and your last name?"
            onChangeText={handleFamilyName}
          />
        </View>
      </View>

      <View style={styles.bottomArea}>
        <Button kind="primary" text="Done" onPress={handleRegister} />
      </View>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(() => ({
  safeAreaView: {
    flex: 1,
    gap: 20,
    paddingHorizontal: 20,
  },
  logo: {
    alignItems: "center",
    paddingTop: 20,
  },
  container: { paddingTop: 20, gap: 20 },
  bottomArea: { flex: 1, justifyContent: "flex-end", marginBottom: 20 },
  done: { flexDirection: "row", justifyContent: "center" },
}));

export default SetProfileScreen;
