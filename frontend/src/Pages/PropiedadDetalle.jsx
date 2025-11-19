import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import { ENDPOINTS } from "../Endpoints/endpoint";
import '../Css/PropiedadDetalle.css';

const PropiedadDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [propiedad, setPropiedad] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Info propiedad
    fetch(`${ENDPOINTS}/api/publicaciones/${id}`)
      .then(res => res.json())
      .then(data => setPropiedad(data))
      .catch(err => console.error(err));

    // Imágenes (usar endpoint común /api/imagenes?id_publicacion=)
    fetch(`${ENDPOINTS}/api/imagenes?id_publicacion=${id}`)
      .then(res => res.json())
      .then(data => setImagenes(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, [id]);

  useEffect(() => {
    // Al cambiar las imágenes, reiniciar índice activo
    setIndex(0);
  }, [imagenes]);

  if (!propiedad) return <p>Cargando...</p>;

  return (
    <div className="detalle-container">
      <button className="btn-volver" onClick={() => navigate('/propiedades')}>← Volver</button>
      <h1>{propiedad.titulo}</h1>

      <div className="carousel-container">
        <Carousel activeIndex={index} onSelect={(selected) => setIndex(selected)}>
          {imagenes.map(img => (
            <Carousel.Item key={img.id_imagen}>
              <img
                className="d-block w-100"
                src={img.url}
                alt="foto"
              />
            </Carousel.Item>
          ))}
        </Carousel>

        {/* Thumbnails: muestra todas las imágenes y permite seleccionar */}
        {imagenes && imagenes.length > 1 && (
          <div className="thumbnails">
            {imagenes.map((img, i) => (
              <div
                key={img.id_imagen || i}
                className={`thumbnail ${i === index ? 'selected' : ''}`}
                onClick={() => setIndex(i)}
              >
                <img src={img.url} alt={`thumb-${i}`} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="detalle-info">
        <p className="precio">${propiedad.precio}</p>
        <p><strong>Descripción:</strong> {propiedad.descripcion}</p>

        <div className="caracteristicas">
          <span>Ambientes: {propiedad.numero_ambientes ?? '-'}</span>
          <span>Dormitorios: {propiedad.numero_dormitorios ?? '-'}</span>
        </div>
      </div>
    </div>
  );
};

export default PropiedadDetalle;
