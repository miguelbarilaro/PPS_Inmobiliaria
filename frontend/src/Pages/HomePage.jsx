import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./HomePage.css";
import * as API from "../Endpoints/endpoint";

const HomePage = () => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", contrasena: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch(API.ENDPOINTS + API.URL_USUARIOS_LIST);
      const usuarios = await res.json();

      const usuarioEncontrado = usuarios.find(
        (u) => u.email === loginForm.email && u.contrasena === loginForm.contrasena
      );

      if (!usuarioEncontrado) {
        setLoginError("Usuario o contraseña incorrectos");
        setLoginLoading(false);
        return;
      }

      // Buscar datos de persona asociada
      const resPersona = await fetch(`${API.ENDPOINTS}${API.URL_PERSONA_ID(usuarioEncontrado.id_persona)}`);
      const persona = await resPersona.json();

      // Buscar datos de dirección asociada a la persona
      let direccion = {};
      let provinciaId = "";
      let departamentoId = "";
      let municipioId = "";

      if (persona.id_direccion) {
        const resDireccion = await fetch(`${API.ENDPOINTS}${API.URL_DIRECCION_ID(persona.id_direccion)}`);
        direccion = await resDireccion.json();
        municipioId = direccion.id_municipio || "";
      }

      // Si tenemos municipioId, buscar departamento y provincia
      if (municipioId) {
        const resMunicipios = await fetch(API.ENDPOINTS + API.URL_MUNICIPIOS_LIST);
        const municipios = await resMunicipios.json();
        const municipioEncontrado = municipios.find(m => Number(m.id_municipio) === Number(municipioId));
        
        if (municipioEncontrado) {
          departamentoId = municipioEncontrado.id_departamento || "";
        }
      }

      // Si tenemos departamentoId, buscar provincia
      if (departamentoId) {
        const resDepartamentos = await fetch(API.ENDPOINTS + API.URL_DEPARTAMENTOS_LIST);
        const departamentos = await resDepartamentos.json();
        const departamentoEncontrado = departamentos.find(d => Number(d.id_departamento) === Number(departamentoId));
        
        if (departamentoEncontrado) {
          provinciaId = departamentoEncontrado.id_provincia || "";
        }
      }

      // Redirigir a RegistrarUsuario con datos precargados
      navigate("/registro", {
        state: {
          email: usuarioEncontrado.email,
          cuil: persona.cuil || "",
          dni: persona.dni || "",
          fecha_nacimiento: persona.fecha_nacimiento || "",
          edad: persona.edad || "",
          provincia: provinciaId,
          departamento: departamentoId,
          municipio: municipioId,
          calle: direccion.calle || "",
          numero: direccion.numero || "",
          ubicacion: direccion.ubicacion || "",
          observaciones: direccion.observaciones || "",
          id_persona: usuarioEncontrado.id_persona,
          id_usuario: usuarioEncontrado.id_usuario,
          id_direccion: persona.id_direccion || null
        }
      });
      setLoginLoading(false);
    } catch (err) {
      console.error(err);
      setLoginError("Error al conectar con el servidor");
      setLoginLoading(false);
    }
  };

  return (
    <div className="home">

      {/* NAVBAR */}
      <nav className="navbar">
        <h1 className="logo">INMOBILITY</h1>

        <div className="nav-buttons">
          <Link to="/login" className="nav-btn">
            Admin
          </Link>

          <button className="nav-btn" onClick={() => setShowLoginModal(true)}>
            Ingresar
          </button>

          <Link to="/registro" className="nav-btn">
            Registrarme
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-box">
          <h2>Encontrá tu próximo hogar o inversión</h2>
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

      {/* MODAL LOGIN */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowLoginModal(false)}>✕</button>
            <h2>Ingresar</h2>

            {loginError && <p className="error-message">{loginError}</p>}

            <form onSubmit={handleLoginSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={loginForm.contrasena}
                onChange={(e) => setLoginForm({ ...loginForm, contrasena: e.target.value })}
                required
              />
              <button type="submit" disabled={loginLoading}>
                {loginLoading ? "Cargando..." : "Ingresar"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
