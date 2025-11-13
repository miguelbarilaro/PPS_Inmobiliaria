import React, { useState, useEffect } from "react";
import { ENDPOINTS, URL_INMUEBLES_LIST, URL_CATEGORIAS_LIST, URL_PROVINCIAS_LIST, URL_DEPARTAMENTOS_LIST, URL_MUNICIPIOS_LIST } from '../Endpoints/endpoint';
import '../Css/VerPropiedades.css';

const VerPropiedades = () => {
  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categorias, setCategorias] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);

  const [filtros, setFiltros] = useState({
    categoria: "",
    provincia: "",
    departamento: "",
    municipio: ""
  });

  // Cargar propiedades (todas inicialmente, luego filtradas)
  const fetchPropiedades = () => {
    setLoading(true);
    fetch(`${ENDPOINTS}${URL_INMUEBLES_LIST}`)
      .then((res) => res.json())
      .then((data) => {
        // Filtrar en el cliente si no usamos query params en el backend
        let filtered = data;
        if (filtros.categoria) {
          filtered = filtered.filter(p => String(p.id_categoria) === String(filtros.categoria));
        }
        setPropiedades(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener propiedades:", err);
        setLoading(false);
      });
  };

  // Cargar todas las listas inicialmente
  useEffect(() => {
    Promise.all([
      fetch(`${ENDPOINTS}${URL_CATEGORIAS_LIST}`).then(res => res.json()),
      fetch(`${ENDPOINTS}${URL_PROVINCIAS_LIST}`).then(res => res.json()),
      fetch(`${ENDPOINTS}${URL_DEPARTAMENTOS_LIST}`).then(res => res.json()),
      fetch(`${ENDPOINTS}${URL_MUNICIPIOS_LIST}`).then(res => res.json()),
    ])
      .then(([cats, provs, deps, muns]) => {
        setCategorias(cats);
        setProvincias(provs);
        setDepartamentos(deps);
        setMunicipios(muns);
      })
      .catch(err => console.error("Error cargando filtros:", err));

    // Cargar propiedades al inicio
    setLoading(true);
    fetch(`${ENDPOINTS}${URL_INMUEBLES_LIST}`)
      .then((res) => res.json())
      .then((data) => {
        setPropiedades(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener propiedades:", err);
        setLoading(false);
      });
  }, []);

  // Filtrar departamentos según provincia seleccionada
  const getDepartamentosByProvincia = () => {
    if (!filtros.provincia) return [];
    return departamentos.filter(d => String(d.id_provincia) === String(filtros.provincia));
  };

  // Filtrar municipios según departamento seleccionado
  const getMunicipiosByDepartamento = () => {
    if (!filtros.departamento) return [];
    return municipios.filter(m => String(m.id_departamento) === String(filtros.departamento));
  };

  // Manejar cambios en selects
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => {
      const updated = { ...prev, [name]: value };
      // Si cambia provincia, resetear departamento y municipio
      if (name === 'provincia') {
        updated.departamento = "";
        updated.municipio = "";
      }
      // Si cambia departamento, resetear municipio
      if (name === 'departamento') {
        updated.municipio = "";
      }
      return updated;
    });
  };

  const deptFiltered = getDepartamentosByProvincia();
  const munFiltered = getMunicipiosByDepartamento();

  return (
    <div className="ver-propiedades-container">
      <h1>Propiedades Disponibles</h1>

      {/* Filtros */}
      <div className="filtros-container">
        <select name="categoria" value={filtros.categoria} onChange={handleChange}>
          <option value="">Todas las categorías</option>
          {categorias.map(cat => (
            <option key={cat.id_categoria} value={cat.id_categoria}>
              {cat.nombre}
            </option>
          ))}
        </select>

        <select name="provincia" value={filtros.provincia} onChange={handleChange}>
          <option value="">Todas las provincias</option>
          {provincias.map(prov => (
            <option key={prov.id_provincia} value={prov.id_provincia}>
              {prov.nombre}
            </option>
          ))}
        </select>

        <select name="departamento" value={filtros.departamento} onChange={handleChange} disabled={!filtros.provincia || deptFiltered.length === 0}>
          <option value="">Todos los departamentos</option>
          {deptFiltered.map(dep => (
            <option key={dep.id_departamento} value={dep.id_departamento}>
              {dep.nombre}
            </option>
          ))}
        </select>

        <select name="municipio" value={filtros.municipio} onChange={handleChange} disabled={!filtros.departamento || munFiltered.length === 0}>
          <option value="">Todos los municipios</option>
          {munFiltered.map(mun => (
            <option key={mun.id_municipio} value={mun.id_municipio}>
              {mun.nombre}
            </option>
          ))}
        </select>

        <button onClick={fetchPropiedades}>Buscar</button>
      </div>

      {/* Propiedades */}
      {loading ? (
        <p>Cargando propiedades...</p>
      ) : propiedades.length === 0 ? (
        <p>No hay propiedades disponibles con esos filtros.</p>
      ) : (
        <div className="propiedades-grid">
          {propiedades.map((propiedad) => (
            <div key={propiedad.id_inmueble} className="propiedad-card">
              <h3>{propiedad.titulo}</h3>
              <p className="descripcion">{propiedad.descripcion}</p>
              {propiedad.categoria && <p><strong>Categoría:</strong> {propiedad.categoria}</p>}
              {propiedad.condicion && <p><strong>Condición:</strong> {propiedad.condicion}</p>}
              {propiedad.tipo_inmueble && <p><strong>Tipo:</strong> {propiedad.tipo_inmueble}</p>}
              {propiedad.numero_dormitorios && <p><strong>Dormitorios:</strong> {propiedad.numero_dormitorios}</p>}
              {propiedad.numero_ambientes && <p><strong>Ambientes:</strong> {propiedad.numero_ambientes}</p>}
              {propiedad.ubicacion && <p><strong>Ubicación:</strong> {propiedad.calle} {propiedad.numero_direccion}, {propiedad.ubicacion}</p>}
              {propiedad.pileta && propiedad.pileta !== 'no' && <p><strong>✓ Pileta</strong></p>}
              {propiedad.terraza && propiedad.terraza !== 'no' && <p><strong>✓ Terraza</strong></p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VerPropiedades;
