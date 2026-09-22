import { makeStyles, useTheme } from '@rneui/themed';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import Text from 'components/Text';

type SettingsFormIntroProps = {
  text: string;
};

export const SettingsFormIntro = ({ text }: SettingsFormIntroProps) => {
  const { theme } = useTheme();
  return <Text kind="description" text={text} color={theme.colors.grey2} />;
};

type SettingsFormFieldsProps = {
  children: ReactNode;
  label?: string;
};

export const SettingsFormFields = ({
  children,
  label,
}: SettingsFormFieldsProps) => {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <View style={styles.block}>
      {label ? (
        <Text kind="littleText" text={label} color={theme.colors.grey2} />
      ) : null}
      <View style={styles.fields}>{children}</View>
    </View>
  );
};

type SettingsFormErrorProps = {
  text: string;
  kind?: 'error' | 'warning';
};

export const SettingsFormError = ({
  text,
  kind = 'error',
}: SettingsFormErrorProps) => {
  const styles = useStyles();
  return (
    <View
      style={[
        styles.notice,
        kind === 'warning' ? styles.warning : styles.error,
      ]}
      accessibilityRole="alert"
    >
      <Text kind="paragraph" text={text} />
    </View>
  );
};

const useStyles = makeStyles(() => ({
  block: {
    gap: 10,
  },
  fields: {
    gap: 10,
  },
  notice: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
  },
  error: {
    backgroundColor: '#FDEDED',
  },
  warning: {
    backgroundColor: '#FFF6E5',
  },
}));
