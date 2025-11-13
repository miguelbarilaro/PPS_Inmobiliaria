// El backend monta los routers bajo '/api' en Backend/index.js
export const ENDPOINTS = 'http://localhost:8000/api'

export const URL_USUARIOS_LIST = '/usuarios'; // GET
export const URL_USUARIO = '/usuarios'; // POST
export const URL_USUARIO_ID = (id) => `/usuarios/${id}`; // GET, PUT, DELETE

export const URL_TIPOINMUEBLES_LIST = '/tipoinmuebles'; // GET
export const URL_TIPOINMUEBLE = '/tipoinmuebles'; // POST
export const URL_TIPOINMUEBLE_ID = (id) => `/tipoinmuebles/${id}`; // GET, PUT, DELETE

export const URL_ROLES_LIST = '/roles'; // GET
export const URL_ROL = '/roles'; // POST
export const URL_ROL_ID = (id) => `/roles/${id}`; // GET, PUT, DELETE

export const URL_PUBLICACIONES_LIST = '/publicaciones'; // GET
export const URL_PUBLICACION = '/publicaciones'; // POST
export const URL_PUBLICACION_ID = (id) => `/publicaciones/${id}`; // GET, PUT, DELETE

export const URL_PROVINCIAS_LIST = '/provincias'; // GET
export const URL_PROVINCIA = '/provincias'; // POST
export const URL_PROVINCIA_ID = (id) => `/provincias/${id}`; // GET, PUT, DELETE

export const URL_PERSONAS_LIST = '/personas'; // GET
export const URL_PERSONA = '/personas'; // POST
export const URL_PERSONA_ID = (id) => `/personas/${id}`; // GET, PUT, DELETE

export const URL_MUNICIPIOS_LIST = '/municipios'; // GET
export const URL_MUNICIPIO = '/municipios'; // POST
export const URL_MUNICIPIO_ID = (id) => `/municipios/${id}`; // GET, PUT, DELETE

export const URL_INMUEBLES_LIST = '/inmuebles'; // GET
export const URL_INMUEBLE = '/inmuebles'; // POST
export const URL_INMUEBLE_ID = (id) => `/inmuebles/${id}`; // GET, PUT, DELETE

export const URL_IMAGENES_LIST = '/imagenes'; // GET
export const URL_IMAGEN = '/imagenes'; // POST
export const URL_IMAGEN_ID = (id) => `/imagenes/${id}`; // GET, PUT, DELETE

export const URL_ESTACIONAMIENTOS_LIST = '/estacionamientos'; // GET
export const URL_ESTACIONAMIENTO = '/estacionamientos'; // POST
export const URL_ESTACIONAMIENTO_ID = (id) => `/estacionamientos/${id}`; // GET, PUT, DELETE

export const URL_DORMITORIOS_LIST = '/dormitorios'; // GET
export const URL_DORMITORIO = '/dormitorios'; // POST
export const URL_DORMITORIO_ID = (id) => `/dormitorios/${id}`; // GET, PUT, DELETE

export const URL_DIRECCIONES_LIST = '/direcciones'; // GET
export const URL_DIRECCION = '/direcciones'; // POST
export const URL_DIRECCION_ID = (id) => `/direcciones/${id}`; // GET, PUT, DELETE

export const URL_DEPARTAMENTOS_LIST = '/departamentos'; // GET
export const URL_DEPARTAMENTO = '/departamentos'; // POST
export const URL_DEPARTAMENTO_ID = (id) => `/departamentos/${id}`; // GET, PUT, DELETE

export const URL_CONDICIONES_LIST = '/condiciones'; // GET
export const URL_CONDICION = '/condiciones'; // POST
export const URL_CONDICION_ID = (id) => `/condiciones/${id}`; // GET, PUT, DELETE

export const URL_CLIENTES_LIST = '/clientes'; // GET
export const URL_CLIENTE = '/clientes'; // POST
export const URL_CLIENTE_ID = (id) => `/clientes/${id}`; // GET, PUT, DELETE

export const URL_CITAS_LIST = '/citas'; // GET
export const URL_CITA = '/citas'; // POST
export const URL_CITA_ID = (id) => `/citas/${id}`; // GET, PUT, DELETE

export const URL_CATEGORIAS_LIST = '/categorias'; // GET
export const URL_CATEGORIA = '/categorias'; // POST
export const URL_CATEGORIA_ID = (id) => `/categorias/${id}`; // GET, PUT, DELETE

export const URL_AUTORIZADAS_LIST = '/autorizadas'; // GET
export const URL_AUTORIZADA = '/autorizadas'; // POST
export const URL_AUTORIZADA_ID = (id) => `/autorizadas/${id}`; // GET, PUT, DELETE

export const URL_AMBIENTES_LIST = '/ambientes'; // GET
export const URL_AMBIENTE = '/ambientes'; // POST
export const URL_AMBIENTE_ID = (id) => `/ambientes/${id}`; // GET, PUT, DELETE

export const URL_PROPIEDADES_LIST = '/propiedades'; // GET
export const URL_PROPIEDAD = '/propiedades'; // POST
export const URL_PROPIEDAD_ID = (id) => `/propiedades/${id}`; // GET, PUT, DELETE