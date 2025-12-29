import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class PortalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: false }; // Não mostramos fallback, apenas ignoramos
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Ignora erros de removeChild em portais - são inofensivos
    if (
      error.message?.includes("removeChild") ||
      error.message?.includes("not a child of this node")
    ) {
      console.debug("[PortalErrorBoundary] Erro de portal ignorado:", error.message);
      return;
    }
    
    // Re-throw outros erros
    throw error;
  }

  render() {
    return this.props.children;
  }
}