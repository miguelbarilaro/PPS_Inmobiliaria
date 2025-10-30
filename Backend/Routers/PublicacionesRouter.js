const express = require('express');
const router = express.Router();

const { mostrarPublicaciones, mostrarPublicacion, crearPublicacion, editarPublicacion, eliminarPublicacion } = require('../Controllers/Publicaciones');

router.get('/publicaciones', mostrarPublicaciones);
router.get('/publicaciones/:id', mostrarPublicacion);
router.post('/publicaciones', crearPublicacion);
router.put('/publicaciones/:id', editarPublicacion);
router.delete('/publicaciones/:id', eliminarPublicacion);

module.exports = router;
