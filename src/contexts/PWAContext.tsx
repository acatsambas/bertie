import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Platform } from 'react-native';

import PWAInstallModal from 'components/PWAInstallModal';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAContextType {
  isInstallable: boolean;
  showInstallPrompt: () => void;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export const PWAProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    console.log('[PWA] Initializing PWA install handler on web platform');

    // Inject manifest link if not already present
    if (!document.querySelector('link[rel="manifest"]')) {
      const manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      manifestLink.href = '/manifest.json';
      document.head.appendChild(manifestLink);
      console.log('[PWA] Injected manifest link');
    }

    // Inject apple-touch-icon if not already present
    if (!document.querySelector('link[rel="apple-touch-icon"]')) {
      const appleIcon = document.createElement('link');
      appleIcon.rel = 'apple-touch-icon';
      appleIcon.href = '/icon-192.png';
      document.head.appendChild(appleIcon);
      console.log('[PWA] Injected apple-touch-icon');
    }

    // Check if user has already dismissed the prompt
    const hasSeenPrompt = localStorage.getItem('pwa-prompt-dismissed');
    if (hasSeenPrompt) {
      console.log('[PWA] User has already dismissed the prompt');
      return;
    }

    // Check if running in standalone mode (already installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      console.log(
        '[PWA] App is already installed (running in standalone mode)',
      );
      return;
    }

    // Detect mobile device (iOS or Android)
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

    // Detect iOS specifically
    const detectedIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    if (detectedIOS) {
      console.log('[PWA] iOS detected - will show manual install instructions');
      setIsIOS(true);
    }

    // On mobile, always allow showing the install prompt
    if (isMobile) {
      console.log('[PWA] Mobile device detected - enabling install prompt');
      setIsInstallable(true);
    }

    // Register service worker for PWA installability
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('[PWA] Service Worker registered:', registration.scope);
        })
        .catch(error => {
          console.error('[PWA] Service Worker registration failed:', error);
        });
    }

    // Listen for beforeinstallprompt (Chrome/Edge on Android)
    const handler = (e: Event) => {
      e.preventDefault();
      console.log('[PWA] beforeinstallprompt event fired!');
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Also listen for app installed event
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App was installed!');
      setDeferredPrompt(null);
      setIsInstallable(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const showInstallPrompt = useCallback(() => {
    console.log('[PWA] showInstallPrompt called', {
      isInstallable,
      hasDeferredPrompt: !!deferredPrompt,
      isIOS,
    });
    if (isInstallable) {
      setIsModalVisible(true);
    }
  }, [isInstallable, deferredPrompt, isIOS]);

  const handleInstall = async () => {
    setIsModalVisible(false);

    if (!deferredPrompt) {
      return;
    }

    await deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const handleClose = () => {
    setIsModalVisible(false);
    // Remember that user has seen/dismissed the prompt
    if (Platform.OS === 'web') {
      localStorage.setItem('pwa-prompt-dismissed', 'true');
    }
  };

  return (
    <PWAContext.Provider value={{ isInstallable, showInstallPrompt }}>
      {children}
      <PWAInstallModal
        isVisible={isModalVisible}
        onClose={handleClose}
        onInstall={handleInstall}
        isIOS={isIOS}
        hasDeferredPrompt={!!deferredPrompt}
      />
    </PWAContext.Provider>
  );
};

export const usePWA = () => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
};
