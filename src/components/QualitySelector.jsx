import React from 'react';
import { Zap, Award, Crown, HardDrive, CheckCircle } from 'lucide-react';
import { QUALITY_SETTINGS } from '../utils/pdf';

const qualities = [
  { 
    id: 'low', 
    icon: Zap,
    color: 'from-green-500 to-emerald-500'
  },
  { 
    id: 'medium', 
    icon: Award,
    color: 'from-orange-500 to-amber-500'
  },
  { 
    id: 'high', 
    icon: Crown,
    color: 'from-purple-500 to-pink-500'
  }
];

const QualitySelector = ({ 
  selectedQuality, 
  onSelectQuality, 
  estimatedSize 
}) => {
  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-slate-400 uppercase tracking-wider block">
        PDF Kalitesi
      </label>
      
      <div className="grid grid-cols-3 gap-3">
        {qualities.map((quality) => {
          const Icon = quality.icon;
          const settings = QUALITY_SETTINGS[quality.id];
          const isSelected = selectedQuality === quality.id;
          
          return (
            <button
              key={quality.id}
              onClick={() => onSelectQuality(quality.id)}
              className={`
                relative p-4 rounded-2xl border-2 transition-all duration-200
                ${isSelected 
                  ? `border-transparent bg-gradient-to-br ${quality.color} shadow-lg scale-105` 
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                }
              `}
              aria-pressed={isSelected}
              aria-label={`${settings.label} kalite seç`}
            >
              <div className="flex flex-col items-center gap-2">
                <Icon 
                  className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-slate-400'}`} 
                />
                <span 
                  className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-slate-300'}`}
                >
                  {settings.label}
                </span>
                <span 
                  className={`text-xs text-center ${isSelected ? 'text-white/80' : 'text-slate-500'}`}
                >
                  {settings.description}
                </span>
              </div>
              
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Estimated size display */}
      {estimatedSize && (
        <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-slate-400" />
            <span className="text-slate-400 text-sm">Tahmini Boyut:</span>
          </div>
          <span className="font-semibold text-white">{estimatedSize}</span>
        </div>
      )}
    </div>
  );
};

export default QualitySelector;
