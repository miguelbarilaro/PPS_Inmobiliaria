const express = require('express');
const router = express.Router();

const { mostrarImagenes, mostrarImagen, crearImagen, editarImagen, eliminarImagen } = require('../Controllers/Imagenes');

router.get('/imagenes', mostrarImagenes);
router.get('/imagenes/:id', mostrarImagen);
router.post('/imagenes', crearImagen);
router.put('/imagenes/:id', editarImagen);
router.delete('/imagenes/:id', eliminarImagen);

module.exports = router;
