import { makeStyles } from '@rneui/themed';
import { ActivityIndicator, View } from 'react-native';

import Text from '../Text';

const LoadingState = () => {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6E78D7" />
      <Text text="Loading..." kind="paragraph" />
    </View>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    flex: 1,
    alignItems: 'center',
  },
}));

export default LoadingState;
