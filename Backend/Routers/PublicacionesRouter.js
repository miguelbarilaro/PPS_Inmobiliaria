const express = require('express');
const router = express.Router();
const { connection } = require('../Config/database');

const { 
  mostrarPublicaciones,
  mostrarPublicacion,
  crearPublicacion,
  editarPublicacion,
  eliminarPublicacion,
  mostrarPublicacionesPendientes,
  mostrarPublicacionesAprobadas,
  aprobarPublicacion,
  rechazarPublicacion
} = require('../Controllers/Publicaciones');

// 📌 Rutas ESPECÍFICAS primero (IMPORTANTÍSIMO)
router.get('/publicaciones/pendientes', mostrarPublicacionesPendientes);
router.get('/publicaciones/aprobadas', mostrarPublicacionesAprobadas);
router.patch('/publicaciones/:id/aprobar', aprobarPublicacion);
router.delete('/publicaciones/:id/rechazar', rechazarPublicacion);


// 📌 Luego las rutas generales
router.get('/publicaciones', mostrarPublicaciones);
router.post('/publicaciones', crearPublicacion);
router.put('/publicaciones/:id', editarPublicacion);
router.delete('/publicaciones/:id', eliminarPublicacion);
router.get('/publicaciones/:id', mostrarPublicacion);

module.exports = router;
