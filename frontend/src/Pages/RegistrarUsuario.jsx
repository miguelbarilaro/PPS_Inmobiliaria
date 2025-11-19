import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as API from '../Endpoints/endpoint';
import '../Css/RegistrarUsuario.css';

const RegistrarUsuario = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const estadoPrecargas = location.state || {};

  const [form, setForm] = useState({
    email: estadoPrecargas.email || '',
    contrasena: '',
    cuil: estadoPrecargas.cuil || '',
    dni: estadoPrecargas.dni || '',
    fecha_nacimiento: estadoPrecargas.fecha_nacimiento || '',
    edad: estadoPrecargas.edad || '',
    provincia: estadoPrecargas.provincia || '',
    departamento: estadoPrecargas.departamento || '',
    municipio: estadoPrecargas.municipio || '',
    calle: estadoPrecargas.calle || '',
    numero: estadoPrecargas.numero || '',
    ubicacion: estadoPrecargas.ubicacion || '',
    observaciones: estadoPrecargas.observaciones || '',
    id_rol: 2,
    id_persona: estadoPrecargas.id_persona || null,
    id_usuario: estadoPrecargas.id_usuario || null,
    id_direccion: estadoPrecargas.id_direccion || null
  });

  const [provincias, setProvincias] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);

  useEffect(() => {
    fetch(API.ENDPOINTS + API.URL_PROVINCIAS_LIST).then(r => r.json()).then(setProvincias).catch(() => setProvincias([]));
    fetch(API.ENDPOINTS + API.URL_DEPARTAMENTOS_LIST).then(r => r.json()).then(setDepartamentos).catch(() => setDepartamentos([]));
    fetch(API.ENDPOINTS + API.URL_MUNICIPIOS_LIST).then(r => r.json()).then(setMunicipios).catch(() => setMunicipios([]));
  }, []);

  const departamentosByProv = () => {
    if (!form.provincia) return [];
    return departamentos.filter(d => String(d.id_provincia) === String(form.provincia));
  };

  const municipiosByDepartamento = () => {
    if (!form.departamento) return [];
    return municipios.filter(m => String(m.id_departamento) === String(form.departamento));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // limpiar selects dependientes
    if (name === 'provincia') setForm(prev => ({ ...prev, departamento: '', municipio: '' }));
    if (name === 'departamento') setForm(prev => ({ ...prev, municipio: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let idDireccion = null;
      let idPersona = form.id_persona;

      // 1) Crear/actualizar dirección (solo si se completa)
      if (form.municipio && form.calle && form.numero) {
        if (!form.id_persona) {
          // crear dirección
          const resDir = await fetch(API.ENDPOINTS + API.URL_DIRECCION, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id_municipio: Number(form.municipio),
              calle: form.calle,
              numero: form.numero,
              ubicacion: form.ubicacion,
              observaciones: form.observaciones
            })
          });
          const dirJson = await resDir.json();
          idDireccion = dirJson.id || dirJson.insertId || dirJson.id_direccion;
        }
      }

      // 2) Si no hay id_persona, crear persona
      if (!form.id_persona) {
        const resPers = await fetch(API.ENDPOINTS + API.URL_PERSONA, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cuil: form.cuil,
            dni: form.dni,
            fecha_nacimiento: form.fecha_nacimiento,
            edad: form.edad,
            id_direccion: idDireccion ? Number(idDireccion) : null
          })
        });
        const persJson = await resPers.json();
        idPersona = persJson.id || persJson.insertId || persJson.id_persona;
      }

      // 3) Si hay id_usuario, actualizar; si no, crear
      if (form.id_usuario) {
        const resUserUpdate = await fetch(`${API.ENDPOINTS}${API.URL_USUARIO_ID(form.id_usuario)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.email,
            contrasena: form.contrasena,
            id_persona: Number(idPersona),
            id_rol: Number(form.id_rol)
          })
        });
        if (!resUserUpdate.ok) throw new Error('Error actualizando usuario');
        alert('Datos actualizados correctamente.');
      } else {
        // crear usuario
        const resUser = await fetch(API.ENDPOINTS + API.URL_USUARIO, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.email,
            contrasena: form.contrasena,
            id_persona: Number(idPersona),
            id_rol: Number(form.id_rol)
          })
        });

        if (!resUser.ok) throw new Error('Error creando usuario');
        alert('Usuario registrado correctamente. Por favor inicia sesión.');
      }

      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('Error al procesar registro. Revisa la consola.');
    }
  };

  return (
    <div className="registro-page">
      <button className="btn-volver" onClick={() => navigate(-1)}>← Volver</button>
      <div className="registro-card">
        <h2>Crear cuenta</h2>
        <form className="registro-form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />

          <label>Contraseña</label>
          <input name="contrasena" type="password" value={form.contrasena} onChange={handleChange} required />

          <label>CUIL</label>
          <input name="cuil" value={form.cuil} onChange={handleChange} />

          <label>DNI</label>
          <input name="dni" value={form.dni} onChange={handleChange} />

          <label>Fecha de nacimiento</label>
          <input name="fecha_nacimiento" type="date" value={form.fecha_nacimiento} onChange={handleChange} />

          <label>Edad</label>
          <input name="edad" type="number" value={form.edad} onChange={handleChange} />

          <hr />

          <label>Provincia</label>
          <select name="provincia" value={form.provincia} onChange={handleChange}>
            <option value="">Seleccionar provincia</option>
            {provincias.map(p => <option key={p.id_provincia} value={p.id_provincia}>{p.nombre}</option>)}
          </select>

          <label>Departamento</label>
          <select name="departamento" value={form.departamento} onChange={handleChange} disabled={!form.provincia}>
            <option value="">Seleccionar departamento</option>
            {departamentosByProv().map(d => <option key={d.id_departamento} value={d.id_departamento}>{d.nombre}</option>)}
          </select>

          <label>Municipio</label>
          <select name="municipio" value={form.municipio} onChange={handleChange} disabled={!form.departamento}>
            <option value="">Seleccionar municipio</option>
            {municipiosByDepartamento().map(m => <option key={m.id_municipio} value={m.id_municipio}>{m.nombre}</option>)}
          </select>

          <label>Calle</label>
          <input name="calle" value={form.calle} onChange={handleChange} />

          <label>Número</label>
          <input name="numero" value={form.numero} onChange={handleChange} />

          <label>Ubicación (opcional)</label>
          <input name="ubicacion" value={form.ubicacion} onChange={handleChange} />

          <label>Observaciones</label>
          <input name="observaciones" value={form.observaciones} onChange={handleChange} />

          {/* Rol asignado por defecto (id_rol=2) - campo oculto en el formulario */}
          <input type="hidden" name="id_rol" value={form.id_rol} />

          <button className="btn-enviar" type="submit">Registrar</button>
        </form>
      </div>
    </div>
  );
};

export default RegistrarUsuario;
