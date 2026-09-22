import { useEffect, useState } from 'react';
import { Platform, useWindowDimensions } from 'react-native';

/** Narrowest window that gets the desktop layout. */
export const DESKTOP_MIN_WIDTH = 1024;

const MOBILE_UA =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

// Width alone can't pick out a desktop browser: a landscape tablet or an
// installed PWA window can be just as wide, and both must keep the mobile
// layout. So also require a mouse, and rule out the installed PWA outright.
const MOUSE_POINTER = '(hover: hover) and (pointer: fine)';
const INSTALLED_PWA = '(display-mode: standalone)';

const isMouseBrowserTab = () =>
  window.matchMedia(MOUSE_POINTER).matches &&
  !window.matchMedia(INSTALLED_PWA).matches &&
  (window.navigator as any).standalone !== true;

/**
 * True on a real desktop/laptop computer in the browser — not phones,
 * tablets, or native apps. Ignores window width (unlike {@link useIsDesktop}).
 * iPadOS 13+ reports as Mac, so touch points are used to catch that case.
 */
export const isDesktopPlatform = () => {
  if (Platform.OS !== 'web' || typeof navigator === 'undefined') return false;
  if (MOBILE_UA.test(navigator.userAgent)) return false;
  if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) {
    return false;
  }
  return true;
};

/**
 * Whether to render the desktop layout. Only ever true on web, in a regular
 * browser tab driven by a mouse, at least DESKTOP_MIN_WIDTH wide. Native apps,
 * phones, touch tablets and the installed PWA always get the mobile layout.
 */
export const useIsDesktop = () => {
  const { width } = useWindowDimensions();
  const [mouseBrowserTab, setMouseBrowserTab] = useState(
    () => Platform.OS === 'web' && isMouseBrowserTab(),
  );

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const queries = [MOUSE_POINTER, INSTALLED_PWA].map(query =>
      window.matchMedia(query),
    );
    const update = () => setMouseBrowserTab(isMouseBrowserTab());

    queries.forEach(query => query.addEventListener('change', update));
    return () =>
      queries.forEach(query => query.removeEventListener('change', update));
  }, []);

  return mouseBrowserTab && width >= DESKTOP_MIN_WIDTH;
};
