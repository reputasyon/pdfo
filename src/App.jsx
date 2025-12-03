import React, { useState, useEffect } from 'react';
import { SplashScreen, HomePage, SettingsPage, ErrorBoundary } from './components';
import { useAppStore } from './store';
import { useOnlineStatus } from './hooks';

const OfflineIndicator = () => (
  <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-yellow-900 text-center py-2 text-sm font-medium z-50">
    Çevrimdışı moddasınız. Bazı özellikler çalışmayabilir.
  </div>
);

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const { currentPage } = useAppStore();
  const isOnline = useOnlineStatus();

  // Handle splash screen completion
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Prevent accidental page close when there's unsaved work
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const { images, pdfReady } = useAppStore.getState();
      
      if (images.length > 0 && !pdfReady) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Show splash screen
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <ErrorBoundary>
      {/* Offline indicator */}
      {!isOnline && <OfflineIndicator />}
      
      {/* Page Router */}
      {currentPage === 'settings' ? (
        <SettingsPage />
      ) : (
        <HomePage />
      )}
    </ErrorBoundary>
  );
}

export default App;
