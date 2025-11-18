const express = require('express');
const router = express.Router();

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
router.patch('/publicaciones/:id/rechazar', rechazarPublicacion);


// 📌 Luego las rutas generales
router.get('/publicaciones', mostrarPublicaciones);
router.post('/publicaciones', crearPublicacion);
router.put('/publicaciones/:id', editarPublicacion);
router.delete('/publicaciones/:id', eliminarPublicacion);
router.get('/publicaciones/:id', mostrarPublicacion);
// Obtener las imágenes de una publicación
router.get("/publicaciones/:id/imagenes", (req, res) => {
    const id = req.params.id;
  
    const query = `
      SELECT * FROM Imagenes
      WHERE id_publicacion = ?
      ORDER BY orden ASC
    `;
  
    connection.query(query, [id], (err, results) => {
      if (err) {
        console.error("Error obteniendo imágenes:", err);
        return res.status(500).json({ message: "Error al obtener imágenes" });
      }
      res.json(results);
    });
  });
  

module.exports = router;
