const express = require('express');
const router = express.Router();

const { mostrarProvincias, mostrarProvincia, crearProvincia, editarProvincia, eliminarProvincia } = require('../Controllers/Provincias');

router.get('/provincias', mostrarProvincias);
router.get('/provincias/:id', mostrarProvincia);
router.post('/provincias', crearProvincia);
router.put('/provincias/:id', editarProvincia);
router.delete('/provincias/:id', eliminarProvincia);

module.exports = router;
