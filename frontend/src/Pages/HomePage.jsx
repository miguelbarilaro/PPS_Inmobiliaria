import React from "react";
import { useNavigate } from "react-router-dom";
import "../Css/HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  console.log("Se está renderizando HomePage ✅");

  return (
    <div className="home-container">
      <header className="header">
        <h1>Inmobiliaria Confiable</h1>
        <button onClick={() => navigate("/login")}>Login</button>
      </header>
      <main className="main-content">
        <h2>Encuentra tu hogar ideal con nosotros</h2>
        <p>Confía en nuestra experiencia para encontrar o publicar tu propiedad.</p>
        <div className="button-group">
          <button onClick={() => navigate("/publicar")}>Publicar propiedad</button>
          <button onClick={() => navigate("/propiedades")}>Ver propiedades</button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
