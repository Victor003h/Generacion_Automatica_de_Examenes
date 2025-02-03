// Importa las librerías necesarias de React y ReactDOM
import React from "react";
import ReactDOM from "react-dom/client";
// Importa el componente principal de la aplicación
import App from "./App.tsx";
// Importa los estilos de Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

// Renderiza la aplicación en el elemento con id "root" en el DOM
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
