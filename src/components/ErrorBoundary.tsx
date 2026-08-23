import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
  onNavigateHome?: () => void;
  key?: string | number;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught CRMsolo ErrorBoundary error:', error, errorInfo);
  }

  private handleReset = () => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({ hasError: false, error: null });
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onNavigateHome) {
      this.props.onNavigateHome();
    } else {
      window.location.href = '/';
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-2xl mx-auto my-12 p-6 sm:p-10 bg-white rounded-3xl border-2 border-red-200 shadow-xl space-y-6 text-center font-sans">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest bg-red-100 text-red-700 px-2.5 py-1 rounded-full font-mono inline-flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> System Recovery Guard
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-primary font-display tracking-tight">
              CMS Data &amp; Rendering Issue Captured
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              We encountered an unexpected error while retrieving or parsing the requested CRM intelligence page. Your data and custom settings remain safe.
            </p>
          </div>

          {this.state.error && (
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-left text-xs font-mono text-gray-700 overflow-x-auto max-h-32">
              <p className="font-bold text-red-600 mb-1">Error Details:</p>
              <code>{this.state.error.message || 'Unknown render exception'}</code>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition active:scale-95"
            >
              <RefreshCw className="w-4 h-4" /> Reset &amp; Reload Data
            </button>
            <button
              onClick={this.handleGoHome}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition"
            >
              <Home className="w-4 h-4" /> Return to Home
            </button>
          </div>

          <p className="text-[10px] text-gray-400 font-mono">
            If this issue persists, try resetting local storage or refreshing your browser tab.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
