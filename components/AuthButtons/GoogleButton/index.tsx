import { useContext } from "react";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import { AuthContext } from "../../../api/auth/AuthProvider";
import { isFirebaseError } from "../../../api/types";

/* https://github.com/chelseafarley/expo-google-signin/blob/main/App.js */

const GoogleButton = () => {
  const { googleLogin } = useContext(AuthContext);

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
    />
  );
};

export default GoogleButton;
