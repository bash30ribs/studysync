/**
 * Service Worker & PWA Installation Controller
 */

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[StudySync PWA] Service Worker registered:', reg.scope);
        })
        .catch((err) => {
          console.warn('[StudySync PWA] Service Worker registration failed:', err);
        });
    });
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
      window.dispatchEvent(new CustomEvent('studysync-pwa-installable'));
    });
  }
}

export function promptPWAInstall(): Promise<boolean> {
  if (!deferredPrompt) {
    return Promise.resolve(false);
  }

  return deferredPrompt.prompt().then(() => {
    return deferredPrompt!.userChoice.then((choice) => {
      deferredPrompt = null;
      return choice.outcome === 'accepted';
    });
  });
}

export function isPWAInstallable(): boolean {
  return deferredPrompt !== null;
}
