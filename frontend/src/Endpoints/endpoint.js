// Backend principal en http://localhost:8000
export const ENDPOINTS = 'http://localhost:8000';

// Todas las rutas van bajo /api
const API = '/api';

// USUARIOS
export const URL_USUARIOS_LIST = `${API}/usuarios`;
export const URL_USUARIO = `${API}/usuarios`;
export const URL_USUARIO_ID = (id) => `${API}/usuarios/${id}`;

// TIPOS DE INMUEBLES
export const URL_TIPOINMUEBLES_LIST = `${API}/tipoinmuebles`;
export const URL_TIPOINMUEBLE = `${API}/tipoinmuebles`;
export const URL_TIPOINMUEBLE_ID = (id) => `${API}/tipoinmuebles/${id}`;

// ROLES
export const URL_ROLES_LIST = `${API}/roles`;
export const URL_ROL = `${API}/roles`;
export const URL_ROL_ID = (id) => `${API}/roles/${id}`;

// PUBLICACIONES
export const URL_PUBLICACIONES_LIST = `${API}/publicaciones`;
export const URL_PUBLICACION = `${API}/publicaciones`;
export const URL_PUBLICACION_ID = (id) => `${API}/publicaciones/${id}`;

export const URL_PUBLICACIONES_PENDIENTES = `${API}/publicaciones/pendientes`;
export const URL_PUBLICACIONES_APROBADAS = `${API}/publicaciones/aprobadas`;
export const URL_PUBLICACION_APROBAR = (id) => `${API}/publicaciones/${id}/aprobar`;
export const URL_PUBLICACION_RECHAZAR = (id) => `${API}/publicaciones/${id}/rechazar`;

// PROVINCIAS
export const URL_PROVINCIAS_LIST = `${API}/provincias`;
export const URL_PROVINCIA = `${API}/provincias`;
export const URL_PROVINCIA_ID = (id) => `${API}/provincias/${id}`;

// PERSONAS
export const URL_PERSONAS_LIST = `${API}/personas`;
export const URL_PERSONA = `${API}/personas`;
export const URL_PERSONA_ID = (id) => `${API}/personas/${id}`;

// MUNICIPIOS
export const URL_MUNICIPIOS_LIST = `${API}/municipios`;
export const URL_MUNICIPIO = `${API}/municipios`;
export const URL_MUNICIPIO_ID = (id) => `${API}/municipios/${id}`;

// INMUEBLES
export const URL_INMUEBLES_LIST = `${API}/inmuebles`;
export const URL_INMUEBLE = `${API}/inmuebles`;
export const URL_INMUEBLE_ID = (id) => `${API}/inmuebles/${id}`;
export const URL_INMUEBLES_PUBLICADOS = `${API}/inmuebles/publicados`;
export const URL_INMUEBLES_PENDIENTES = `${API}/inmuebles/pendientes`;
export const URL_INMUEBLE_APROBAR = (id) => `${API}/inmuebles/${id}/aprobar`;
export const URL_INMUEBLE_RECHAZAR = (id) => `${API}/inmuebles/${id}/rechazar`;

// IMÁGENES
export const URL_IMAGENES_LIST = `${API}/imagenes`;
export const URL_IMAGEN = `${API}/imagenes`;
export const URL_IMAGEN_ID = (id) => `${API}/imagenes/${id}`;

// ESTACIONAMIENTOS
export const URL_ESTACIONAMIENTOS_LIST = `${API}/estacionamientos`;
export const URL_ESTACIONAMIENTO = `${API}/estacionamientos`;
export const URL_ESTACIONAMIENTO_ID = (id) => `${API}/estacionamientos/${id}`;

// DORMITORIOS
export const URL_DORMITORIOS_LIST = `${API}/dormitorios`;
export const URL_DORMITORIO = `${API}/dormitorios`;
export const URL_DORMITORIO_ID = (id) => `${API}/dormitorios/${id}`;

// DIRECCIONES
export const URL_DIRECCIONES_LIST = `${API}/direcciones`;
export const URL_DIRECCION = `${API}/direcciones`;
export const URL_DIRECCION_ID = (id) => `${API}/direcciones/${id}`;

// DEPARTAMENTOS
export const URL_DEPARTAMENTOS_LIST = `${API}/departamentos`;
export const URL_DEPARTAMENTO = `${API}/departamentos`;
export const URL_DEPARTAMENTO_ID = (id) => `${API}/departamentos/${id}`;

// CONDICIONES
export const URL_CONDICIONES_LIST = `${API}/condiciones`;
export const URL_CONDICION = `${API}/condiciones`;
export const URL_CONDICION_ID = (id) => `${API}/condiciones/${id}`;

// CLIENTES
export const URL_CLIENTES_LIST = `${API}/clientes`;
export const URL_CLIENTE = `${API}/clientes`;
export const URL_CLIENTE_ID = (id) => `${API}/clientes/${id}`;

// CITAS
export const URL_CITAS_LIST = `${API}/citas`;
export const URL_CITA = `${API}/citas`;
export const URL_CITA_ID = (id) => `${API}/citas/${id}`;

// CATEGORÍAS
export const URL_CATEGORIAS_LIST = `${API}/categorias`;
export const URL_CATEGORIA = `${API}/categorias`;
export const URL_CATEGORIA_ID = (id) => `${API}/categorias/${id}`;

// AUTORIZADAS
export const URL_AUTORIZADAS_LIST = `${API}/autorizadas`;
export const URL_AUTORIZADA = `${API}/autorizadas`;
export const URL_AUTORIZADA_ID = (id) => `${API}/autorizadas/${id}`;

// AMBIENTES
export const URL_AMBIENTES_LIST = `${API}/ambientes`;
export const URL_AMBIENTE = `${API}/ambientes`;
export const URL_AMBIENTE_ID = (id) => `${API}/ambientes/${id}`;

// PROPIEDADES
export const URL_PROPIEDADES_LIST = `${API}/propiedades`;
export const URL_PROPIEDAD = `${API}/propiedades`;
export const URL_PROPIEDAD_ID = (id) => `${API}/propiedades/${id}`;
