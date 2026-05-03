import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Application render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 text-white">
          <div className="max-w-lg rounded-[2rem] border border-white/10 bg-white/10 p-8 text-center backdrop-blur-xl shadow-2xl shadow-slate-950/30">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Application error</p>
            <h1 className="mt-4 text-2xl font-bold">The dashboard failed to render.</h1>
            <p className="mt-3 text-slate-300">
              Refresh the page. If the problem continues, check the browser console for the first error.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
