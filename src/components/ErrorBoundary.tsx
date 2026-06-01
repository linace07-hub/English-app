import React, { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  declare readonly props: Props;
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('App error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50 text-center">
          <p className="text-4xl mb-4">⚠️</p>
          <h1 className="text-xl font-black text-slate-900 mb-2">Algo salió mal</h1>
          <p className="text-slate-500 mb-6 max-w-md">
            Recarga la página. Si sigue igual, borra los datos guardados del sitio en tu navegador.
          </p>
          <button
            type="button"
            onClick={() => {
              try {
                localStorage.removeItem('user_current_view');
              } catch {
                /* ignore */
              }
              window.location.reload();
            }}
            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700"
          >
            Recargar app
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
