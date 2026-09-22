import { makeStyles } from '@rneui/themed';
import { Pressable, View } from 'react-native';

import Icon from 'components/Icon';
import Text from 'components/Text';

type BackTitleHeaderProps = {
  title: string;
  onBack?: () => void;
};

export const BackTitleHeader = ({ title, onBack }: BackTitleHeaderProps) => {
  const styles = useStyles();

  if (onBack) {
    return (
      <Pressable
        onPress={onBack}
        style={styles.header}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        <Icon icon="back" />
        <Text kind="bigHeader" text={title} />
      </Pressable>
    );
  }

  return (
    <View style={styles.header}>
      <Text kind="bigHeader" text={title} />
    </View>
  );
};

const useStyles = makeStyles(() => ({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
}));

export default BackTitleHeader;
