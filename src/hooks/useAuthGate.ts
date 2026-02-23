import { useContext, useCallback } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AuthContext } from 'api/auth/AuthProvider';

import { translations } from 'locales/translations';

/**
 * Hook to gate features behind authentication for guest (anonymous) users.
 *
 * Returns:
 * - `isGuest`: true if the current user is signed in anonymously
 * - `requireAuth(message?)`: shows an alert prompting the user to sign up.
 *   If they accept, signs them out so RootNavigator shows the auth flow.
 *   Returns `true` if the user is a guest (action was blocked), `false` otherwise.
 */
export const useAuthGate = () => {
    const { user, logout } = useContext(AuthContext);
    const { t } = useTranslation();

    const isGuest = !!user?.isAnonymous;

    const requireAuth = useCallback(
        (message?: string): boolean => {
            if (!isGuest) return false;

            Alert.alert(
                t(translations.authGate.title),
                message || t(translations.authGate.description),
                [
                    { text: t(translations.authGate.cancel), style: 'cancel' },
                    {
                        text: t(translations.authGate.signUp),
                        onPress: () => {
                            void logout();
                        },
                    },
                ],
            );

            return true;
        },
        [isGuest, logout, t],
    );

    return { isGuest, requireAuth };
};
