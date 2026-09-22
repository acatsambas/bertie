import { makeStyles, useTheme } from '@rneui/themed';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';

import { useUserQuery } from 'api/app/user';
import { AuthContext } from 'api/auth/AuthProvider';
import { useGuest } from 'api/guest/GuestProvider';
import googleG from 'components/AuthButtons/GoogleButton/assets/google-g.png';
import Avatar from 'components/Avatar';
import { SoftCard } from 'components/SoftCard';
import Text from 'components/Text';
import { translations } from 'locales/translations';

export const SettingsProfileHeader = () => {
  const { t } = useTranslation();
  const styles = useStyles();
  const { theme } = useTheme();
  const { user } = useContext(AuthContext);
  const { data: userData } = useUserQuery();
  const { isGuest } = useGuest();

  const providerIds = user?.providerData.map(p => p.providerId) ?? [];
  const hasGoogle = providerIds.includes('google.com');
  const hasApple = providerIds.includes('apple.com');
  const hasPassword = providerIds.includes('password');

  const displayName =
    [userData?.givenName, userData?.familyName].filter(Boolean).join(' ') ||
    user?.displayName ||
    '';
  const email = user?.email ?? userData?.email ?? '';

  return (
    <SoftCard style={styles.card}>
      <Avatar size={64} />
      <View style={styles.copy}>
        {isGuest ? (
          <>
            <Text kind="header" text={t(translations.settings.profile.guest)} />
            <Text
              kind="littleText"
              text={t(translations.settings.profile.limited)}
              color={theme.colors.primary}
            />
          </>
        ) : (
          <>
            {displayName ? <Text kind="header" text={displayName} /> : null}
            {email ? (
              <Text
                kind="description"
                text={email}
                color={theme.colors.grey2}
              />
            ) : null}
            <View style={styles.providers}>
              {hasGoogle ? (
                <View style={styles.providerRow}>
                  <Image source={googleG} style={styles.providerIcon} />
                  <Text
                    kind="littleText"
                    text={t(translations.settings.profile.connectedGoogle)}
                    color={theme.colors.grey2}
                  />
                </View>
              ) : null}
              {hasApple ? (
                <Text
                  kind="littleText"
                  text={t(translations.settings.profile.connectedApple)}
                  color={theme.colors.grey2}
                />
              ) : null}
              {hasPassword && !hasGoogle && !hasApple ? (
                <Text
                  kind="littleText"
                  text={t(translations.settings.profile.connectedEmail)}
                  color={theme.colors.grey2}
                />
              ) : null}
            </View>
          </>
        )}
      </View>
    </SoftCard>
  );
};

const useStyles = makeStyles({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  providers: {
    marginTop: 2,
    gap: 6,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  providerIcon: {
    width: 14,
    height: 14,
  },
});
