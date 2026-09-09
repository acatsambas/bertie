import { useNavigation } from '@react-navigation/native';
import { useContext, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AuthContext } from 'api/auth/AuthProvider';
import { useGuest } from 'api/guest/GuestProvider';

import { Routes } from 'navigation/routes';

import { translations } from 'locales/translations';

/**
 * Hook to gate features behind a real account.
 *
 * Two kinds of visitor need gating: guests, who tapped "Explore without an
 * account" and whose data lives in local storage, and logged-out visitors,
 * who reach the public book screen through a shared /book/:bookId link.
 *
 * Returns:
 * - `isGuest`: true if they are exploring without an account
 * - `isLoggedOut`: true if there is no user at all
 * - `requireAuth(message?)`: shows a sign-up modal. Returns true if the
 *   user needs an account (action was blocked), false otherwise.
 * - `gateVisible`: whether the auth gate modal is visible
 * - `gateMessage`: the message to show in the modal
 * - `dismissGate()`: close the modal
 * - `confirmGate()`: send the visitor into the account creation flow
 */
export const useAuthGate = () => {
    const { user } = useContext(AuthContext);
    const { isGuest, exitGuestMode } = useGuest();
    const { t } = useTranslation();
    const navigation = useNavigation<any>();

    // Someone browsing a shared book link is neither signed in nor a guest.
    const isLoggedOut = !user && !isGuest;
    const needsAccount = isGuest || isLoggedOut;

    const [gateVisible, setGateVisible] = useState(false);
    const [gateMessage, setGateMessage] = useState('');

    const requireAuth = useCallback(
        (message?: string): boolean => {
            if (!needsAccount) return false;

            setGateMessage(
                message || t(translations.authGate.description),
            );
            setGateVisible(true);
            return true;
        },
        [needsAccount, t],
    );

    const dismissGate = useCallback(() => {
        setGateVisible(false);
    }, []);

    const confirmGate = useCallback(() => {
        setGateVisible(false);

        if (isLoggedOut) {
            // Push the auth navigator over the current screen rather than
            // replacing it. Once registration completes the auth route is no
            // longer part of the root navigator, so React Navigation drops it
            // and the screen underneath — the book they came for — is focused
            // again, with its params intact.
            navigation.navigate(Routes.ROOT_01_AUTH, {
                screen: Routes.AUTH_03_REGISTER,
            });
            return;
        }

        // Guests have no Firebase session to end — leaving guest mode is what
        // swaps the app navigator back for the auth flow. Their local books
        // stay put and are migrated once they finish creating an account.
        void exitGuestMode();
    }, [isLoggedOut, exitGuestMode, navigation]);

    return {
        isGuest,
        isLoggedOut,
        requireAuth,
        gateVisible,
        gateMessage,
        dismissGate,
        confirmGate,
    };
};
