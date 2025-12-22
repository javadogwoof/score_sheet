import { Component, type ErrorInfo, type ReactNode } from 'react';
import { reportError } from '@/lib/posthog';
import styles from './ErrorBoundary.module.scss';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);

    // PostHogにエラーを報告
    reportError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <h1 className={styles.title}>エラーが発生しました</h1>
          <p className={styles.message}>
            申し訳ございません。アプリケーションでエラーが発生しました。
          </p>
          <button
            type="button"
            className={styles.button}
            onClick={() => window.location.reload()}
          >
            ページを再読み込み
          </button>
          {import.meta.env.DEV && this.state.error && (
            <details className={styles.details}>
              <summary>エラー詳細（開発環境のみ）</summary>
              <pre className={styles.errorStack}>
                {this.state.error.message}
                {'\n\n'}
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
