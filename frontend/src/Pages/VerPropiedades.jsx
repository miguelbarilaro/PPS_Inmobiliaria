import React, { useState, useEffect } from "react";

const VerPropiedades = () => {
  const [propiedades, setPropiedades] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/propiedades")
      .then((response) => response.json())
      .then((data) => setPropiedades(data))
      .catch((error) => console.error("Error al obtener propiedades:", error));
  }, []);

  return (
    <div>
      <h1>Propiedades Disponibles</h1>
      <ul>
        {propiedades.map((propiedad) => (
          <li key={propiedad.id}>
            <h3>{propiedad.titulo}</h3>
            <p>{propiedad.descripcion}</p>
            <p>Precio: {propiedad.precio}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VerPropiedades;