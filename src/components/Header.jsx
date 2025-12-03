import React from 'react';
import { Settings } from 'lucide-react';
import { Badge, IconButton } from './ui';
import { useAppStore, useCoverStore } from '../store';

const Header = () => {
  const { images, setCurrentPage } = useAppStore();
  const { coverInfo } = useCoverStore();

  const hasCoverInfo = coverInfo.brandName || coverInfo.logo || coverInfo.whatsapp1;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/50">
      <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center">
            <span className="text-xl font-black text-white">P</span>
          </div>
          <span className="font-black text-xl">
            Pdf<span className="text-orange-400">o</span>
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {images.length > 0 && (
            <Badge variant="brand">
              {images.length} fotoğraf
            </Badge>
          )}

          <div className="relative">
            <IconButton
              icon={Settings}
              onClick={() => setCurrentPage('settings')}
              aria-label="Ayarlar"
            />
            {!hasCoverInfo && (
              <span
                className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"
                aria-hidden="true"
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
