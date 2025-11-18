import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="home">

      {/* NAVBAR */}
      <nav className="navbar">
        <h1 className="logo">INMOBILITY</h1>

        <div className="nav-buttons">
          <Link to="/login" className="nav-btn">
            Admin
          </Link>

          <Link to="/registro" className="nav-btn">
            Registro
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-box">
          <h2>Encontrá tu próximo hogar</h2>
          <p>
            La plataforma inmobiliaria más confiable para publicar o buscar propiedades.
          </p>

          <div className="hero-actions">
            <Link to="/publicar" className="btn-primary">
              Publicar Propiedad
            </Link>

            <Link to="/propiedades" className="btn-secondary">
              Ver Propiedades
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features">

        <div className="feature-card">
        <img src="https://images.unsplash.com/photo-1572120360610-d971b9b78830?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" />



          <h3>Propiedades verificadas</h3>
          <p>Hogares reales controlados por nuestro equipo.</p>
        </div>

        <div className="feature-card">
          <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2" />
          <h3>Asesoría profesional</h3>
          <p>Te acompañamos en cada paso del proceso.</p>
        </div>

        <div className="feature-card">
          <img src="https://images.unsplash.com/photo-1600573472592-401b489a3cdc" />
          <h3>Experiencia premium</h3>
          <p>Rápido, moderno y confiable para todo tipo de usuarios.</p>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="footer">
        © 2025 Inmobility — Todos los derechos reservados.
      </footer>

    </div>
  );
};

export default HomePage;
