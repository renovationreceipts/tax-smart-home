
import React from 'react';
import { Button } from "@/components/ui/button";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md w-full p-6 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Oops, something went wrong</h2>
            <p className="text-muted-foreground mb-6">
              We're sorry for the inconvenience. Please try again.
            </p>
            <Button onClick={this.handleRetry}>Retry</Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
