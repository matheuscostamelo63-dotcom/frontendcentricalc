import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Suprime o erro específico do removeChild no console do Chrome e outros navegadores
const suppressPortalErrors = () => {
  const originalError = console.error;
  console.error = (...args) => {
    const message = args[0]?.toString() || "";
    
    // Lista de mensagens de erro inofensivas relacionadas a portais/desmontagem
    if (
      message.includes("removeChild") ||
      message.includes("not a child of this node") ||
      message.includes("NotFoundError") ||
      message.includes("The node to be removed is not a child of this node")
    ) {
      return; // Silencia o erro
    }
    
    originalError.apply(console, args);
  };

  // Captura erros não tratados relacionados a portais
  window.addEventListener("error", (event) => {
    if (
      event.message?.includes("removeChild") ||
      event.message?.includes("not a child of this node") ||
      event.message?.includes("The node to be removed is not a child of this node")
    ) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  });
};

suppressPortalErrors();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);