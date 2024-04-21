import { makeStyles } from "@rneui/themed";
import * as AppleAuthentication from "expo-apple-authentication";

interface AppleSigninButtonProps {
  onPress?(): void;
}

const AppleSigninButton = ({ onPress }) => {
  const styles = useStyles();
  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      style={styles.appleButton}
      cornerRadius={5}
      onPress={onPress}
    />
  );
};

const useStyles = makeStyles(() => ({
  appleButton: {
    width: "100%",
    height: 54,
  },
}));

export default AppleSigninButton;
