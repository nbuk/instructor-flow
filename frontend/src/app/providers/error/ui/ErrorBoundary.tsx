import LogRocket from 'logrocket';
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    LogRocket.captureException(error, {
      ...(!!info.componentStack && {
        extra: { componentStack: info.componentStack },
      }),
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <h1>Что-то пошло не так...</h1>;
    }

    return this.props.children;
  }
}
