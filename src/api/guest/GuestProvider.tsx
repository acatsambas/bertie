import { useQueryClient } from '@tanstack/react-query';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { AuthContext } from 'api/auth/AuthProvider';

import {
  clearGuestData,
  migrateGuestDataToUser,
  readGuestMode,
  writeGuestMode,
} from './guestStore';

/**
 * Tracks whether someone is exploring without an account.
 *
 * This replaces the anonymous Firebase sign-in that "Explore without an
 * account" used to perform: guest mode is a local flag, and everything a
 * guest creates lives in local storage until they make a real account.
 */
export const GuestContext = createContext<{
  /** exploring without an account */
  isGuest: boolean;
  /** true until the persisted flag has been read back */
  guestLoading: boolean;
  enterGuestMode: () => Promise<void>;
  exitGuestMode: () => Promise<void>;
}>(undefined as any);

export interface GuestProviderProps {
  children: React.ReactNode;
}

export const GuestProvider = ({ children }: GuestProviderProps) => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [isGuest, setIsGuest] = useState(false);
  const [guestLoading, setGuestLoading] = useState(true);
  const migratingRef = useRef(false);

  useEffect(() => {
    (async () => {
      setIsGuest(await readGuestMode());
      setGuestLoading(false);
    })();
  }, []);

  const enterGuestMode = useCallback(async () => {
    await writeGuestMode(true);
    setIsGuest(true);
  }, []);

  const exitGuestMode = useCallback(async () => {
    await writeGuestMode(false);
    setIsGuest(false);
  }, []);

  // A guest who signs in or registers takes their books, ratings, favourite
  // shops and address with them. Runs once per sign-in; the guard matters
  // because onAuthStateChanged can fire again while the writes are in flight.
  useEffect(() => {
    if (!user || migratingRef.current) return;

    migratingRef.current = true;

    (async () => {
      let migrated = false;
      try {
        migrated = await migrateGuestDataToUser(user.uid);
      } catch (error) {
        // Losing the guest's few local books is not worth blocking sign-in
        // over, and the data stays put so a later sign-in can retry.
        console.error('Could not migrate guest data:', error);
        return;
      }

      // Signed in and a guest are mutually exclusive, so the flag always goes.
      await writeGuestMode(false);
      setIsGuest(false);

      if (migrated) {
        await clearGuestData();
        // Anything cached against the guest session is meaningless now.
        queryClient.clear();
      }
    })();
  }, [user, queryClient]);

  // Signing out returns the app to a clean slate rather than a guest session.
  useEffect(() => {
    if (user) return;
    migratingRef.current = false;
  }, [user]);

  const value = useMemo(
    () => ({ isGuest, guestLoading, enterGuestMode, exitGuestMode }),
    [isGuest, guestLoading, enterGuestMode, exitGuestMode],
  );

  return (
    <GuestContext.Provider value={value}>{children}</GuestContext.Provider>
  );
};

export const useGuest = () => useContext(GuestContext);
