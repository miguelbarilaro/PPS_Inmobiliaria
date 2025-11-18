import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import { ENDPOINTS } from "../Endpoints/endpoint";

const PropiedadDetalle = () => {
  const { id } = useParams();
  const [propiedad, setPropiedad] = useState(null);
  const [imagenes, setImagenes] = useState([]);

  useEffect(() => {
    // Info propiedad
    fetch(`${ENDPOINTS}/api/publicaciones/${id}`)
      .then(res => res.json())
      .then(data => setPropiedad(data))
      .catch(err => console.error(err));

    // Imágenes
    fetch(`${ENDPOINTS}/api/publicaciones/${id}/imagenes`)
      .then(res => res.json())
      .then(data => setImagenes(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!propiedad) return <p>Cargando...</p>;

  return (
    <div className="detalle-container">
      <h1>{propiedad.titulo}</h1>

      <Carousel>
        {imagenes.map(img => (
          <Carousel.Item key={img.id_imagen}>
            <img
              className="d-block w-100"
              src={img.url}
              alt="foto"
              style={{
                height: "420px",
                objectFit: "cover",
                borderRadius: "15px"
              }}
            />
          </Carousel.Item>
        ))}
      </Carousel>

      <div className="detalle-info">
        <p><strong>Descripción:</strong> {propiedad.descripcion}</p>
        <p><strong>Precio:</strong> ${propiedad.precio}</p>
        <p><strong>Ambientes:</strong> {propiedad.numero_ambientes}</p>
        <p><strong>Dormitorios:</strong> {propiedad.numero_dormitorios}</p>
      </div>
    </div>
  );
};

export default PropiedadDetalle;
