import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Suprime o erro específico do removeChild no console do Chrome
const originalError = console.error;
console.error = (...args) => {
  const message = args[0]?.toString() || "";
  
  // Ignora erros de portal do Radix
  if (
    message.includes("removeChild") ||
    message.includes("not a child of this node") ||
    message.includes("NotFoundError")
  ) {
    return; // Silencia o erro
  }
  
  originalError.apply(console, args);
};

// Captura erros não tratados relacionados a portais
window.addEventListener("error", (event) => {
  if (
    event.message?.includes("removeChild") ||
    event.message?.includes("not a child of this node")
  ) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);