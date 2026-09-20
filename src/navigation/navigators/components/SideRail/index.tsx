import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles, useTheme } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, PressableStateCallbackType, View } from 'react-native';

import { useUserQuery } from 'api/app/user';
import Avatar from 'components/Avatar';
import Icon from 'components/Icon';
import { useSoftCardStyles } from 'components/SoftCard';
import Text from 'components/Text';
import { useDraftOrder } from 'contexts/DraftOrderContext';
import { translations } from 'locales/translations';
import { Routes } from 'navigation/routes';
import type { NavigationType } from 'navigation/types';

import { menuItems } from '../BottomMenu/data';

// react-native-web adds `hovered` to Pressable's state; React Native's own
// types don't know about it.
type WebPressableState = PressableStateCallbackType & { hovered?: boolean };

type HomeTab = (typeof menuItems)[number]['screen'];

/**
 * The Home tab navigator's state and navigation, when the rail is its tab
 * bar. Absent on the book screen, which sits outside the tabs.
 */
type SideRailProps = Partial<Pick<BottomTabBarProps, 'state' | 'navigation'>>;

/**
 * The desktop stand-in for BottomMenu: the same three destinations in a rail
 * down the left edge, plus the link to settings that sits in the My list
 * header on mobile.
 */
const SideRail = ({ state, navigation: tabNavigation }: SideRailProps) => {
  const { navigate } = useNavigation<StackNavigationProp<NavigationType>>();
  const { data: userData } = useUserQuery();
  const { count: draftOrderCount } = useDraftOrder();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useStyles();
  const softCard = useSoftCardStyles();

  const activeScreen = state?.routes[state.index]?.name;
  const name = [userData?.givenName, userData?.familyName]
    .filter(Boolean)
    .join(' ');

  const handlePress = (screen: HomeTab) => {
    const route = state?.routes.find(({ name }) => name === screen);

    if (!state || !tabNavigation || !route) {
      // Outside the tabs, address the tab from the root, as BottomMenu does.
      navigate(Routes.ROOT_02_APP, {
        screen: Routes.APP_01_HOME,
        params: { screen },
      });
      return;
    }

    // Do what the stock tab bar does: announce the press, so a tab that is
    // already showing pops its stack back to its first screen, and only
    // then switch tabs.
    const event = tabNavigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (screen !== activeScreen && !event.defaultPrevented) {
      tabNavigation.dispatch({
        ...CommonActions.navigate(route),
        target: state.key,
      });
    }
  };

  return (
    <View style={styles.rail}>
      <Text kind="header" text="Bertie" style={styles.brand} />
      <View style={styles.nav}>
        {menuItems.map(menu => {
          const active = menu.screen === activeScreen;
          const color = active ? theme.colors.white : theme.colors.secondary;
          const isOrder = menu.screen === Routes.HOME_03_ORDER;
          const badgeCount = isOrder ? draftOrderCount : 0;
          const showBadge = badgeCount > 0;
          const badgeLabel =
            badgeCount === 1
              ? t(translations.order.menuBadgeOne)
              : t(translations.order.menuBadge, { count: badgeCount });

          return (
            <Pressable
              key={menu.title}
              accessibilityRole="link"
              accessibilityState={{ selected: active }}
              accessibilityLabel={
                showBadge ? `${menu.title}, ${badgeLabel}` : menu.title
              }
              style={pressState => [
                styles.item,
                (pressState as WebPressableState).hovered && styles.itemHovered,
                active && styles.itemActive,
              ]}
              onPress={() => handlePress(menu.screen)}
            >
              <View style={styles.iconWrap}>
                <Icon icon={menu.icon} color={color} size={20} />
                {showBadge && (
                  <View
                    style={[styles.badge, active && styles.badgeOnActive]}
                    accessibilityElementsHidden
                  >
                    <Text
                      kind="littleText"
                      text={badgeCount > 99 ? '99+' : String(badgeCount)}
                      color={active ? theme.colors.primary : theme.colors.white}
                      style={styles.badgeText}
                    />
                  </View>
                )}
              </View>
              <Text kind="paragraph" text={menu.title} color={color} />
            </Pressable>
          );
        })}
      </View>
      <Pressable
        accessibilityRole="link"
        style={pressState => [
          softCard.card,
          styles.account,
          (pressState as WebPressableState).hovered && styles.itemHovered,
        ]}
        onPress={() =>
          navigate(Routes.APP_02_SETTINGS, {
            screen: Routes.SETTINGS_01_SETTINGS,
          })
        }
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
  iconWrap: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.grey0,
  },
  badgeOnActive: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.primary,
  },
  badgeText: {
    fontFamily: 'Commissioner_700Bold',
    fontSize: 10,
    lineHeight: 12,
  },
  itemHovered: { backgroundColor: 'rgba(34, 34, 34, 0.05)' },
  itemActive: { backgroundColor: theme.colors.primary },
  account: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  accountText: { flex: 1, gap: 2 },
}));

export default SideRail;
