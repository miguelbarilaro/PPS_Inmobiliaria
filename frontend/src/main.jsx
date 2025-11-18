import React from "react";
import ReactDOM from "react-dom/client";
import './index.css'
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";


console.log("Main.jsx se está ejecutando ✅");


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
