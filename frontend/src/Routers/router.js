import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Ambientes from '../Components/Ambientes'
import Autorizadas from '../Components/Autorizadas'
import Categorias from '../Components/Categorias'
import Citas from '../Components/Citas'
import Clientes from '../Components/Clientes'
import Condiciones from '../Components/Condiciones'
import Departamentos from '../Components/Departamentos'
import Direcciones from '../Components/Direcciones'
import Dormitorios from '../Components/Dormitorios'
import Estacionamientos from '../Components/Estacionamientos'
import Imagenes from '../Components/Imagenes'
import Inmuebles from '../Components/Inmuebles'
import Municipios from '../Components/Municipios'
import Personas from '../Components/Personas'
import Propiedades from '../Components/Propiedades'
import Provincias from '../Components/Provincias'
import Publicaciones from '../Components/Publicaciones'
import AdminEditarPublicacion from '../Pages/AdminEditarPublicacion'
import Roles from '../Components/Roles'
import Tipoinmuebles from '../Components/Tipoinmuebles'
import Usuarios from '../Components/Usuarios'


const routes = [
	{ path: '/', label: 'Inicio' },
	{ path: '/ambientes', label: 'Ambientes', element: <Ambientes /> },
	{ path: '/autorizadas', label: 'Autorizadas', element: <Autorizadas /> },
	{ path: '/categorias', label: 'Categorias', element: <Categorias /> },
	{ path: '/citas', label: 'Citas', element: <Citas /> },
	{ path: '/clientes', label: 'Clientes', element: <Clientes /> },
	{ path: '/condiciones', label: 'Condiciones', element: <Condiciones /> },
	{ path: '/departamentos', label: 'Departamentos', element: <Departamentos /> },
	{ path: '/direcciones', label: 'Direcciones', element: <Direcciones /> },
	{ path: '/dormitorios', label: 'Dormitorios', element: <Dormitorios /> },
	{ path: '/estacionamientos', label: 'Estacionamientos', element: <Estacionamientos /> },
	{ path: '/imagenes', label: 'Imagenes', element: <Imagenes /> },
	{ path: '/inmuebles', label: 'Inmuebles', element: <Inmuebles /> },
	{ path: '/municipios', label: 'Municipios', element: <Municipios /> },
	{ path: '/personas', label: 'Personas', element: <Personas /> },
	{ path: '/propiedades', label: 'Propiedades', element: <Propiedades /> },
	{ path: '/provincias', label: 'Provincias', element: <Provincias /> },
	{ path: '/publicaciones', label: 'Publicaciones', element: <Publicaciones /> },
	{ path: '/roles', label: 'Roles', element: <Roles /> },
	{ path: '/tipoinmuebles', label: 'TipoInmuebles', element: <Tipoinmuebles /> },
	{ path: '/usuarios', label: 'Usuarios', element: <Usuarios /> }
	
]

function Home() {
	return (
		<div style={{ padding: 20 }}>
			<h2>Bienvenido al panel de prueba</h2>
			<p>Usa la navegación para acceder a los componentes generados.</p>
		</div>
	)
}

export default function AppRouter() {
	return (
		<BrowserRouter>
			<div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
				<header style={{ background: '#0d6efd', color: 'white', padding: '10px 20px' }}>
					<nav style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
						{routes.map((r) => (
							<Link key={r.path} to={r.path} style={{ color: 'white', textDecoration: 'none' }}>
								{r.label}
							</Link>
						))}
					</nav>
				</header>

				<main style={{ flex: 1, padding: 20 }}>
				<Routes>
						<Route path="/" element={<Home />} />
						{routes
							.filter((r) => r.element)
							.map((r) => (
									<Route key={r.path} path={r.path} element={r.element} />
								))}

						{/* Ruta administrativa para editar publicaciones (no aparece en el menú) */}
						<Route path="/admin/publicaciones/editar/:id" element={<AdminEditarPublicacion />} />
					</Routes>
				</main>

				<footer style={{ padding: 8, textAlign: 'center', background: '#f1f1f1' }}>
					<small>Panel de navegación - rutas CRUD generadas</small>
				</footer>
			</div>
		</BrowserRouter>
	)
}

