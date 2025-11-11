import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <header style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
        <h1>Inmobiliaria Confiable</h1>
        <button onClick={() => navigate("/login")}>Login</button>
      </header>
      <main style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Encuentra tu hogar ideal con nosotros</h2>
        <p>Confía en nuestra experiencia para encontrar o publicar tu propiedad.</p>
        <div style={{ marginTop: "30px" }}>
          <button onClick={() => navigate("/publicar")} style={{ margin: "10px", padding: "20px" }}>
            Publicar propiedad
          </button>
          <button onClick={() => navigate("/propiedades")} style={{ margin: "10px", padding: "20px" }}>
            Ver propiedades
          </button>
        </div>
      </main>
      <section style={{ marginTop: "50px", padding: "20px", backgroundColor: "#f9f9f9" }}>
        <h3>¿Quiénes somos?</h3>
        <p>
          Somos una empresa dedicada a conectar a propietarios y compradores de inmuebles. Nuestro objetivo es
          ofrecer un servicio confiable y eficiente para que encuentres la propiedad de tus sueños o publiques la
          tuya con facilidad.
        </p>
        <p>
          Al confiar en nosotros, obtendrás asesoramiento profesional, una plataforma fácil de usar y la seguridad
          de que tu propiedad será vista por miles de personas interesadas.
        </p>
      </section>
    </div>
  );
};

export default HomePage;