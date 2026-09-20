import { makeStyles } from '@rneui/themed';
import { Image, ImageStyle, StyleProp } from 'react-native';

import DefaultIllustration from './assets/default.png';
import WelcomeIllustration from './assets/welcome.png';

const illustrations = {
  welcome: WelcomeIllustration,
  default: DefaultIllustration,
};

interface IllustrationProps {
  name: keyof typeof illustrations;
  /** Fill the parent; parent must have a bounded height (e.g. flex). */
  fill?: boolean;
  style?: StyleProp<ImageStyle>;
}

const Illustration = ({ name, fill = false, style }: IllustrationProps) => {
  const styles = useStyles();
  return (
    <Image
      style={[fill ? styles.fill : styles.illustration, style]}
      source={illustrations[name] || illustrations.default}
      resizeMode="contain"
    />
  );
};

const useStyles = makeStyles(() => ({
  illustration: {
    height: 300,
    width: '100%',
  },
  fill: {
    width: '100%',
    height: '100%',
  },
}));

export default Illustration;
