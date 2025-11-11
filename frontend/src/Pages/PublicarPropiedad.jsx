import React, { useState } from "react";

const PublicarPropiedad = () => {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    precio: "",
    ambientes: "",
    dormitorios: "",
    provincia: "",
    municipio: "",
    condicion: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:8000/api/publicar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Propiedad enviada para revisión");
        console.log("Respuesta del servidor:", data);
      })
      .catch((error) => console.error("Error al enviar los datos:", error));
  };

  return (
    <div>
      <h1>Publicar Propiedad</h1>
      <form onSubmit={handleSubmit}>
        <input name="titulo" placeholder="Título" onChange={handleChange} required />
        <textarea name="descripcion" placeholder="Descripción" onChange={handleChange} required />
        <input name="precio" placeholder="Precio" type="number" onChange={handleChange} required />
        <input name="ambientes" placeholder="Ambientes" type="number" onChange={handleChange} required />
        <input name="dormitorios" placeholder="Dormitorios" type="number" onChange={handleChange} required />
        <input name="provincia" placeholder="Provincia" onChange={handleChange} required />
        <input name="municipio" placeholder="Municipio" onChange={handleChange} required />
        <select name="condicion" onChange={handleChange} required>
          <option value="">Condición</option>
          <option value="nueva">Nueva</option>
          <option value="usada">Usada</option>
          <option value="en_construccion">En construcción</option>
        </select>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default PublicarPropiedad;