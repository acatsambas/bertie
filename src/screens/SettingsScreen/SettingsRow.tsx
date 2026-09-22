import { makeStyles, useTheme } from '@rneui/themed';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import Icon, { IconProps } from 'components/Icon';
import Text from 'components/Text';

export type SettingsRowProps = {
  icon: IconProps['icon'];
  title: string;
  description?: string;
  isLast?: boolean;
  onPress?: () => void;
  showChevron?: boolean;
};

export const SettingsRow = ({
  icon,
  title,
  description,
  onPress,
  showChevron = Boolean(onPress),
}: SettingsRowProps) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const interactive = Boolean(onPress);

  const body = (
    <>
      <Icon icon={icon} size={22} color={theme.colors.secondary} />
      <View style={styles.copy}>
        <Text kind="paragraph" text={title} />
        {description ? (
          <Text
            kind="littleText"
            text={description}
            color={theme.colors.grey2}
          />
        ) : null}
      </View>
      {showChevron ? (
        <Icon icon="right" size={18} color={theme.colors.grey2} />
      ) : null}
    </>
  );

  if (!interactive) {
    return (
      <View style={styles.row} accessibilityRole="none">
        {body}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      {body}
    </Pressable>
  );
};

type SettingsSectionProps = {
  title: string;
  children: ReactNode;
};

export const SettingsSection = ({ title, children }: SettingsSectionProps) => {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <View style={styles.section}>
      <Text kind="littleText" text={title} color={theme.colors.grey2} />
      <View style={styles.sectionRows}>{children}</View>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  section: {
    gap: 10,
  },
  sectionRows: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 54,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: theme.colors.grey0,
  },
  rowPressed: {
    opacity: 0.72,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
}));
