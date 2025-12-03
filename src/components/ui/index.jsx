import React from 'react';
import { Loader2, AlertCircle, CheckCircle, X } from 'lucide-react';

// Button Component
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:opacity-90 active:scale-98',
    secondary: 'bg-slate-700 text-white hover:bg-slate-600 active:scale-98',
    ghost: 'bg-transparent text-slate-300 hover:bg-slate-700/50',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:scale-98'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
      {children}
    </button>
  );
};

// Input Component
export const Input = ({
  label,
  icon: Icon,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-slate-400 uppercase tracking-wider block">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        )}
        <input
          className={`
            w-full bg-slate-800/50 border border-slate-700 rounded-xl 
            py-3 ${Icon ? 'pl-12' : 'pl-4'} pr-4 
            text-white placeholder-slate-500 
            focus:outline-none focus:border-orange-500 
            transition-colors
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
};

// TextArea Component
export const TextArea = ({
  label,
  icon: Icon,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-slate-400 uppercase tracking-wider block">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-4 w-5 h-5 text-slate-500" />
        )}
        <textarea
          className={`
            w-full bg-slate-800/50 border border-slate-700 rounded-xl 
            py-3 ${Icon ? 'pl-12' : 'pl-4'} pr-4 
            text-white placeholder-slate-500 
            focus:outline-none focus:border-orange-500 
            transition-colors resize-none
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
};

// Card Component
export const Card = ({ 
  children, 
  variant = 'default',
  className = '',
  onClick,
  ...props 
}) => {
  const variants = {
    default: 'bg-slate-800/50 border-slate-700',
    success: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30',
    warning: 'bg-orange-500/10 border-orange-500/30',
    error: 'bg-red-500/20 border-red-500/30',
    brand: 'bg-gradient-to-r from-orange-500/10 to-pink-500/10 border-orange-500/20'
  };

  return (
    <div
      className={`
        rounded-2xl border p-4 
        ${variants[variant]}
        ${onClick ? 'cursor-pointer hover:bg-opacity-80 transition-colors' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

// Alert Component
export const Alert = ({ 
  type = 'info', 
  message, 
  onClose,
  className = '' 
}) => {
  const types = {
    info: {
      bg: 'bg-blue-500/20 border-blue-500/30',
      text: 'text-blue-300',
      icon: AlertCircle
    },
    success: {
      bg: 'bg-green-500/20 border-green-500/30',
      text: 'text-green-300',
      icon: CheckCircle
    },
    warning: {
      bg: 'bg-yellow-500/20 border-yellow-500/30',
      text: 'text-yellow-300',
      icon: AlertCircle
    },
    error: {
      bg: 'bg-red-500/20 border-red-500/30',
      text: 'text-red-300',
      icon: AlertCircle
    }
  };

  const config = types[type];
  const Icon = config.icon;

  if (!message) return null;

  return (
    <div 
      className={`
        ${config.bg} border rounded-xl p-3 
        flex items-start gap-3 
        animate-fade-in
        ${className}
      `}
    >
      <Icon className={`w-5 h-5 ${config.text} flex-shrink-0 mt-0.5`} />
      <p className={`${config.text} text-sm flex-1`}>{message}</p>
      {onClose && (
        <button 
          onClick={onClose}
          className={`${config.text} hover:opacity-70 flex-shrink-0`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// Modal Component
export const Modal = ({ 
  isOpen, 
  onClose, 
  title,
  children,
  className = ''
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <div 
        className={`
          w-full max-w-lg bg-slate-800 
          rounded-t-3xl sm:rounded-3xl 
          p-6 pb-8 
          animate-slide-up
          ${className}
        `}
        onClick={e => e.stopPropagation()}
      >
        <div className="w-12 h-1 bg-slate-600 rounded-full mx-auto mb-6 sm:hidden" />
        {title && (
          <h3 className="text-xl font-bold mb-6 text-center text-white">{title}</h3>
        )}
        {children}
      </div>
    </div>
  );
};

// Badge Component
export const Badge = ({ 
  children, 
  variant = 'default',
  className = '' 
}) => {
  const variants = {
    default: 'bg-slate-700 text-slate-300',
    brand: 'bg-orange-500/20 text-orange-300',
    success: 'bg-green-500/20 text-green-300'
  };

  return (
    <span 
      className={`
        text-xs px-3 py-1 rounded-full font-medium
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

// Progress Bar Component
export const ProgressBar = ({ 
  value = 0, 
  max = 100,
  showLabel = false,
  className = '' 
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-slate-400 text-right">{Math.round(percentage)}%</p>
      )}
    </div>
  );
};

// Skeleton Component
export const Skeleton = ({ 
  width, 
  height, 
  rounded = 'lg',
  className = '' 
}) => {
  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full'
  };

  return (
    <div 
      className={`
        bg-slate-700/50 animate-pulse
        ${roundedClasses[rounded]}
        ${className}
      `}
      style={{ width, height }}
    />
  );
};

// Icon Button Component
export const IconButton = ({
  icon: Icon,
  onClick,
  variant = 'default',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) => {
  const variants = {
    default: 'bg-slate-700/50 hover:bg-slate-700 text-white',
    danger: 'bg-red-500/90 hover:bg-red-600 text-white',
    ghost: 'bg-transparent hover:bg-slate-700/50 text-slate-400'
  };

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <button
      className={`
        ${sizes[size]}
        ${variants[variant]}
        rounded-xl flex items-center justify-center
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <Icon className={iconSizes[size]} />
    </button>
  );
};
