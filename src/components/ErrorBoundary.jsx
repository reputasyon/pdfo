import React, { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
    
    // Here you could send error to logging service
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            {/* Error Icon */}
            <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>
            
            {/* Error Message */}
            <h1 className="text-2xl font-bold text-white mb-2">
              Bir Hata Oluştu
            </h1>
            <p className="text-slate-400 mb-6">
              Üzgünüz, beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
            </p>
            
            {/* Error Details (Development only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-slate-500 text-sm cursor-pointer hover:text-slate-400">
                  Hata Detayları
                </summary>
                <pre className="mt-2 p-3 bg-slate-800 rounded-lg text-xs text-red-400 overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            
            {/* Reset Button */}
            <button
              onClick={this.handleReset}
              className="
                inline-flex items-center gap-2 
                px-6 py-3 
                bg-gradient-to-r from-orange-500 to-pink-500 
                text-white font-semibold 
                rounded-xl 
                hover:opacity-90 
                transition-opacity
              "
            >
              <RefreshCw className="w-5 h-5" />
              Sayfayı Yenile
            </button>
            
            {/* Logo */}
            <div className="mt-12 flex items-center justify-center gap-2 text-slate-600">
              <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-xs font-black text-white">P</span>
              </div>
              <span className="font-bold">Pdfo</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
