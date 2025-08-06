import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function InstallApp() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  const handleIOSInstall = () => {
    // Show iOS installation instructions
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      alert(t('install.ios_instructions'));
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  if (isInstalled || isDismissed) {
    return null; // Don't show install button if already installed or dismissed
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {showInstallButton && (
        <div className="relative">
          <button
            onClick={handleInstallClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            {t('install.install_app')}
          </button>
          <button
            onClick={handleDismiss}
            className="absolute -top-2 -right-2 bg-gray-800 hover:bg-gray-900 text-white rounded-full w-6 h-6 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-bold"
          >
            ×
          </button>
        </div>
      )}
      
      {/* iOS Install Instructions */}
      {/iPad|iPhone|iPod/.test(navigator.userAgent) && !isInstalled && (
        <div className="relative mt-2">
          <button
            onClick={handleIOSInstall}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            {t('install.ios_install')}
          </button>
          <button
            onClick={handleDismiss}
            className="absolute -top-2 -right-2 bg-gray-800 hover:bg-gray-900 text-white rounded-full w-6 h-6 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-bold"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}