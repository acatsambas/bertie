import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { makeStyles } from "@rneui/themed";

import Logo from "../../components/Logo";
import Button from "../../components/Button";
import Text from "../../components/Text";
import Input from "../../components/Input";
import { AuthNavigatorParamList } from "../../navigation/AuthStack/params";
import { useState } from "react";

export interface SetProfilePageProps
  extends StackNavigationProp<AuthNavigatorParamList, "SetProfile"> {}

const SetProfileScreen = () => {
  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");

  const styles = useStyles();
  const { navigate } = useNavigation<SetProfilePageProps>();

  const handleRegister = () => {
    console.log("Registration part is over");
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
            kind="altceva"
            onChangeText={handleGivenName}
          />
          <Input
            placeholder="...and your last name?"
            kind="altceva"
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
