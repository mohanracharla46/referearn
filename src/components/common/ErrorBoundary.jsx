import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 text-zinc-950 font-sans">
          <div className="max-w-md w-full bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-4 text-center">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h2 className="text-lg font-bold text-zinc-900">Something went wrong</h2>
            <p className="text-xs text-zinc-500">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/auth/login';
                }}
                className="px-4 py-2 bg-zinc-950 text-white rounded-lg text-xs font-bold hover:bg-zinc-800 transition-subtle cursor-pointer"
              >
                Reset Session & Login
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.reload();
                }}
                className="px-4 py-2 bg-zinc-100 text-zinc-800 rounded-lg text-xs font-bold hover:bg-zinc-200 transition-subtle cursor-pointer"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
