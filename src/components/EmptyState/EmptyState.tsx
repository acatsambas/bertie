import { makeStyles, useTheme } from '@rneui/themed';
import { type ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import Button from 'components/Button';
import Icon, { IconProps } from 'components/Icon';
import Text from 'components/Text';

type EmptyStateAction = {
  label: string;
  onPress: () => void;
  kind?: 'primary' | 'secondary' | 'tertiary';
};

type EmptyStateProps = {
  title: string;
  description?: string;
  /** Quiet subject mark inside the plate (existing Icon set). */
  icon?: IconProps['icon'];
  action?: EmptyStateAction;
  children?: ReactNode;
  variant?: 'page' | 'list' | 'section';
  style?: StyleProp<ViewStyle>;
};

/**
 * Shared empty / soft-error surface. Page and list share one full-width
 * top-aligned bookplate; section is muted body under an Insights heading.
 */
export const EmptyState = ({
  title,
  description,
  icon,
  action,
  children,
  variant = 'list',
  style,
}: EmptyStateProps) => {
  const styles = useStyles();
  const { theme } = useTheme();

  if (variant === 'section') {
    return (
      <View style={[styles.section, style]}>
        <Text
          kind="description"
          text={description ?? title}
          color={theme.colors.grey2}
        />
      </View>
    );
  }

  return (
    <View style={[styles.plate, variant === 'page' && styles.pageFill, style]}>
      <View style={styles.plateOuter}>
        <View style={styles.plateInner}>
          {icon ? (
            <Icon
              icon={icon}
              size={22}
              color={theme.colors.secondary}
              style={styles.mark}
            />
          ) : null}
          <Text kind="header" text={title} style={styles.title} />
          {description ? (
            <Text
              kind="paragraph"
              text={description}
              color={theme.colors.grey2}
              style={styles.description}
            />
          ) : null}
          {action ? (
            <Button
              kind={action.kind ?? 'primary'}
              text={action.label}
              onPress={action.onPress}
              containerStyle={styles.action}
            />
          ) : null}
        </View>
      </View>
      {children ? <View style={styles.children}>{children}</View> : null}
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  // Same top alignment for every plate empty — page only fills remaining height.
  // Top spacing comes from the parent (list content / tab gutter), not here.
  plate: {
    alignSelf: 'stretch',
    width: '100%',
    paddingBottom: 20,
    gap: 20,
  },
  pageFill: {
    flex: 1,
  },
  section: {
    paddingTop: 4,
  },
  plateOuter: {
    width: '100%',
    borderWidth: 1,
    borderColor: theme.colors.grey0,
    borderRadius: 12,
    padding: 3,
    backgroundColor: theme.colors.white,
  },
  plateInner: {
    borderWidth: 1,
    borderColor: theme.colors.grey0,
    borderRadius: 9,
    paddingVertical: 22,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    gap: 10,
  },
  mark: {
    marginBottom: 2,
  },
  title: {
    textAlign: 'left',
  },
  description: {
    textAlign: 'left',
  },
  action: {
    marginTop: 8,
    width: '100%',
  },
  children: {
    width: '100%',
    gap: 12,
  },
}));

export default EmptyState;
