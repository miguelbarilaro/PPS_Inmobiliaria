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
        
        {/* ========== DATOS DE LA PUBLICACIÓN ========== */}
        <div className="seccion">
          <h3>Información de la Publicación</h3>
          <p><strong>Título:</strong> {propiedad.titulo}</p>
          <p><strong>Descripción:</strong> {propiedad.descripcion_inmueble || propiedad.descripcion}</p>
          <p><strong>Servicios:</strong> {propiedad.servicios || 'N/A'}</p>
        </div>

        {/* ========== CARACTERÍSTICAS DEL INMUEBLE ========== */}
        <div className="seccion">
          <h3>Características del Inmueble</h3>
          <p><strong>Categoría:</strong> {propiedad.categoria_inmueble || 'N/A'}</p>
          <p><strong>Tipo de Inmueble:</strong> {propiedad.tipo_inmueble || 'N/A'}</p>
          <p><strong>Condición:</strong> {propiedad.condicion || 'N/A'}</p>
          <p><strong>Ambientes:</strong> {propiedad.numero_ambientes || 'N/A'}</p>
          <p><strong>Dormitorios:</strong> {propiedad.numero_dormitorios || 'N/A'}</p>
          <p><strong>Estacionamiento:</strong> {propiedad.numero_estacionamiento || 'N/A'}</p>
          <p><strong>Pileta:</strong> {propiedad.pileta && (propiedad.pileta === 'sí' || propiedad.pileta === 1) ? 'Sí' : 'No'}</p>
          <p><strong>Terraza:</strong> {propiedad.terraza && (propiedad.terraza === 'sí' || propiedad.terraza === 1) ? 'Sí' : 'No'}</p>
        </div>

        {/* ========== UBICACIÓN ========== */}
        <div className="seccion">
          <h3>Ubicación</h3>
          <p><strong>Provincia:</strong> {propiedad.provincia || 'N/A'}</p>
          <p><strong>Departamento:</strong> {propiedad.departamento || 'N/A'}</p>
          <p><strong>Municipio:</strong> {propiedad.municipio || 'N/A'}</p>
          <p><strong>Calle:</strong> {propiedad.calle || 'N/A'}</p>
          <p><strong>Número:</strong> {propiedad.numero_direccion || 'N/A'}</p>
          <p><strong>Ubicación:</strong> {propiedad.ubicacion || 'N/A'}</p>
          <p><strong>Observaciones:</strong> {propiedad.observaciones || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default PropiedadDetalle;
