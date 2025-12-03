import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const SplashScreen = ({ onComplete, minDuration = 2000 }) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const targetProgress = 100;
    const duration = minDuration;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * targetProgress, targetProgress);
      
      setProgress(newProgress);

      if (newProgress < targetProgress) {
        requestAnimationFrame(animate);
      } else {
        setIsComplete(true);
        setTimeout(onComplete, 300);
      }
    };

    requestAnimationFrame(animate);
  }, [minDuration, onComplete]);

  return (
    <div 
      className={`
        fixed inset-0 z-50
        bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 
        flex flex-col items-center justify-center overflow-hidden
        transition-opacity duration-300
        ${isComplete ? 'opacity-0' : 'opacity-100'}
      `}
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" 
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" 
          style={{ animationDelay: '0.5s' }} 
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse" 
          style={{ animationDelay: '1s' }} 
        />
      </div>
      
      {/* Logo and branding */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-8">
          {/* Main logo */}
          <div 
            className="
              w-32 h-32 
              bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 
              rounded-3xl 
              flex items-center justify-center 
              shadow-2xl shadow-orange-500/30 
              transform rotate-3 hover:rotate-0 
              transition-transform duration-500
            "
          >
            <span className="text-5xl font-black text-white tracking-tighter select-none">
              P
            </span>
          </div>
          
          {/* Sparkle badge */}
          <div 
            className="
              absolute -top-2 -right-2 
              w-8 h-8 
              bg-gradient-to-br from-yellow-400 to-orange-500 
              rounded-full 
              flex items-center justify-center 
              animate-bounce
            "
          >
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>
        
        {/* App name */}
        <h1 className="text-5xl font-black text-white mb-2 tracking-tight select-none">
          Pdf
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">
            o
          </span>
        </h1>
        
        {/* Tagline */}
        <p className="text-slate-400 text-sm mb-12 tracking-widest uppercase select-none">
          Fotoğraftan PDF'e
        </p>
        
        {/* Progress bar */}
        <div className="w-64 h-1.5 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm">
          <div 
            className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Progress text */}
        <p className="text-slate-500 text-xs mt-4 font-mono select-none">
          {Math.round(progress)}%
        </p>
      </div>

      {/* Version info */}
      <div className="absolute bottom-8 text-slate-600 text-xs">
        v1.0.0
      </div>
    </div>
  );
};

export default SplashScreen;
