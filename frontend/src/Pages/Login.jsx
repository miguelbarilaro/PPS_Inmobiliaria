import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem("usuario", JSON.stringify(data.user));
          navigate("/admin");
        } else {
          alert(data.message || "Credenciales incorrectas");
        }
      })
      .catch((error) => console.error("Error en el login:", error));
  };

  return (
    <div className="login-background">

      <div className="login-card">

        {/* 🔥 Botón volver dentro del contenedor */}
        <button
          className="btn-volver-login-inside"
          onClick={() => navigate("/")}
        >
          ← Volver
        </button>

        {/* Ícono de usuario */}
        <div className="login-icon">
          <i className="fas fa-user-shield"></i>
        </div>

        <h2 className="login-title">Panel Administrador</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            name="email"
            placeholder="Usuario"
            value={credentials.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={credentials.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="login-btn">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
