import { useContext, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AuthContext } from 'api/auth/AuthProvider';

import { translations } from 'locales/translations';

/**
 * Hook to gate features behind authentication for guest (anonymous) users.
 *
 * Returns:
 * - `isGuest`: true if the current user is signed in anonymously
 * - `requireAuth(message?)`: shows a sign-up modal. Returns true if the
 *   user is a guest (action was blocked), false otherwise.
 * - `gateVisible`: whether the auth gate modal is visible
 * - `gateMessage`: the message to show in the modal
 * - `dismissGate()`: close the modal
 * - `confirmGate()`: sign up (logs out, redirecting to auth flow)
 */
export const useAuthGate = () => {
    const { user, logout } = useContext(AuthContext);
    const { t } = useTranslation();

    const isGuest = !!user?.isAnonymous;

    const [gateVisible, setGateVisible] = useState(false);
    const [gateMessage, setGateMessage] = useState('');

    const requireAuth = useCallback(
        (message?: string): boolean => {
            if (!isGuest) return false;

            setGateMessage(
                message || t(translations.authGate.description),
            );
            setGateVisible(true);
            return true;
        },
        [isGuest, t],
    );

    const dismissGate = useCallback(() => {
        setGateVisible(false);
    }, []);

    const confirmGate = useCallback(() => {
        setGateVisible(false);
        void logout();
    }, [logout]);

    return {
        isGuest,
        requireAuth,
        gateVisible,
        gateMessage,
        dismissGate,
        confirmGate,
    };
};
