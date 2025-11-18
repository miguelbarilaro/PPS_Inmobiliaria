const express = require("express");
const router = express.Router();

const {
  mostrarImagenes,
  mostrarImagen,
  crearImagen,
  eliminarImagen,
  obtenerImagenesPorPublicacion
} = require("../Controllers/Imagenes");

// Rutas normales
router.get("/imagenes", mostrarImagenes);
router.get("/imagenes/:id", mostrarImagen);
router.post("/imagenes", crearImagen);
router.delete("/imagenes/:id", eliminarImagen);

// RUTA NUEVA: obtener fotos por publicación
router.get("/publicaciones/:id/imagenes", obtenerImagenesPorPublicacion);

module.exports = router;
