import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles, useTheme } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, PressableStateCallbackType, View } from 'react-native';

import Avatar from 'components/Avatar';
import Icon from 'components/Icon';
import Text from 'components/Text';

import { useUserQuery } from 'api/app/user';

import { Routes } from 'navigation/routes';
import type { NavigationType } from 'navigation/types';

import { translations } from 'locales/translations';

import { menuItems } from '../BottomMenu/data';

// react-native-web adds `hovered` to Pressable's state; React Native's own
// types don't know about it.
type WebPressableState = PressableStateCallbackType & { hovered?: boolean };

interface SideRailProps {
  /** The Home tab on screen, if any — the book screen sits outside the tabs. */
  activeScreen?: string;
}

/**
 * The desktop stand-in for BottomMenu: the same three destinations in a rail
 * down the left edge, plus the link to settings that sits in the My list
 * header on mobile.
 */
const SideRail = ({ activeScreen }: SideRailProps) => {
  const { navigate } = useNavigation<StackNavigationProp<NavigationType>>();
  const { data: userData } = useUserQuery();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useStyles();

  const name = [userData?.givenName, userData?.familyName]
    .filter(Boolean)
    .join(' ');

  return (
    <View style={styles.rail}>
      <Text kind="header" text="Bertie" style={styles.brand} />
      <View style={styles.nav}>
        {menuItems.map(menu => {
          const active = menu.screen === activeScreen;
          const color = active ? theme.colors.white : theme.colors.secondary;

          return (
            <Pressable
              key={menu.title}
              accessibilityRole="link"
              accessibilityState={{ selected: active }}
              style={state => [
                styles.item,
                (state as WebPressableState).hovered && styles.itemHovered,
                active && styles.itemActive,
              ]}
              onPress={() =>
                // Addressed from the root, as in BottomMenu, so this also
                // works from the root-level book screen.
                navigate(Routes.ROOT_02_APP, {
                  screen: Routes.APP_01_HOME,
                  params: { screen: menu.screen },
                })
              }
            >
              <Icon icon={menu.icon} color={color} size={20} />
              <Text kind="paragraph" text={menu.title} color={color} />
            </Pressable>
          );
        })}
      </View>
      <Pressable
        accessibilityRole="link"
        style={state => [
          styles.account,
          (state as WebPressableState).hovered && styles.itemHovered,
        ]}
        onPress={() => navigate(Routes.APP_02_SETTINGS)}
      >
        <Avatar size={36} />
        <View style={styles.accountText}>
          {!!name && <Text kind="description" text={name} />}
          <Text
            kind="littleText"
            text={t(translations.settings.title)}
            color={theme.colors.grey2}
          />
        </View>
      </Pressable>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  rail: {
    width: 232,
    backgroundColor: theme.colors.grey0,
    borderRightWidth: 1,
    borderRightColor: 'rgba(34, 34, 34, 0.08)',
    paddingHorizontal: 16,
    paddingTop: 28,
    paddingBottom: 16,
  },
  brand: {
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  nav: { gap: 4 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  itemHovered: { backgroundColor: 'rgba(34, 34, 34, 0.05)' },
  itemActive: { backgroundColor: theme.colors.primary },
  account: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 8,
  },
  accountText: { flex: 1, gap: 2 },
}));

export default SideRail;
