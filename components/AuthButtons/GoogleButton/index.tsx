import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";

/* https://github.com/chelseafarley/expo-google-signin/blob/main/App.js */

const GoogleButton = () => {
  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Standard}
      color={GoogleSigninButton.Color.Light}
      onPress={() => {
        console.log("test Google");
      }}
    />
  );
};

export default GoogleButton;
