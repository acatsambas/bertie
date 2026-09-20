import { makeStyles, useTheme } from '@rneui/themed';
import { View } from 'react-native';

import Button from 'components/Button';
import Icon from 'components/Icon';
import Text from 'components/Text';

type AddressNeededNoticeProps = {
  title: string;
  description: string;
  actionLabel: string;
  onPress: () => void;
};

export const AddressNeededNotice = ({
  title,
  description,
  actionLabel,
  onPress,
}: AddressNeededNoticeProps) => {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <View style={styles.box} accessibilityRole="alert">
      <View style={styles.header}>
        <Icon icon="address" size={20} color={theme.colors.secondary} />
        <Text kind="header" text={title} style={styles.title} />
      </View>
      <Text
        kind="paragraph"
        text={description}
        color={theme.colors.grey2}
        style={styles.description}
      />
      <Button
        kind="primary"
        text={actionLabel}
        onPress={onPress}
        containerStyle={styles.action}
      />
    </View>
  );
};

const useStyles = makeStyles(() => ({
  box: {
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: '#FFF6E5',
    borderWidth: 1,
    borderColor: '#E6D3A8',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    flex: 1,
    textAlign: 'left',
  },
  description: {
    textAlign: 'left',
  },
  action: {
    marginTop: 8,
    width: '100%',
  },
}));

export default AddressNeededNotice;
