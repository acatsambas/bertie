// import { Image } from "@rneui/themed";
import { Image } from "react-native";
import { makeStyles } from "@rneui/themed";

import WelcomeIllustration from "./assets/welcome.png";
import DefaultIllustration from "./assets/default.png";

const illustrations = {
  welcome: WelcomeIllustration,
  default: DefaultIllustration,
};

interface IllustrationProps {
  name: keyof typeof illustrations;
}

const Illustration = ({ name }: IllustrationProps) => {
  const styles = useStyles();
  return (
    <Image
      style={styles.illustration}
      source={illustrations[name] || illustrations.default}
    />
  );
};

const useStyles = makeStyles(() => ({
  illustration: {
    height: 240,
    width: "100%",
  },
}));

export default Illustration;
