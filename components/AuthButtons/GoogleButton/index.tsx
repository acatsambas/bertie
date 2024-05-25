import { useContext } from "react";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { makeStyles } from "@rneui/themed";

import { AuthContext } from "../../../api/auth/AuthProvider";
import { isFirebaseError } from "../../../api/types";

/* https://github.com/chelseafarley/expo-google-signin/blob/main/App.js */

const GoogleButton = () => {
  const { googleLogin } = useContext(AuthContext);
  const styles = useStyles();

  const handleLogin = async () => {
    try {
      await googleLogin();
    } catch (error) {
      if (isFirebaseError(error)) {
        console.log(error);
      }
    }
  };

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Light}
      onPress={handleLogin}
      style={styles.appleButton}
    />
  );
};

const useStyles = makeStyles(() => ({
  appleButton: {
    width: "100%",
    height: 54,
  },
}));

export default GoogleButton;
