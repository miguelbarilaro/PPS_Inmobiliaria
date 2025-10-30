const express = require('express');
const router = express.Router();

const { mostrarDirecciones, mostrarDireccion, crearDireccion, editarDireccion, eliminarDireccion } = require('../Controllers/Direcciones');

router.get('/direcciones', mostrarDirecciones);
router.get('/direcciones/:id', mostrarDireccion);
router.post('/direcciones', crearDireccion);
router.put('/direcciones/:id', editarDireccion);
router.delete('/direcciones/:id', eliminarDireccion);

module.exports = router;
