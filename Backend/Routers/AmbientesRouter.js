const express = require('express');
const router = express.Router();

const { mostrarAmbientes, mostrarAmbiente, crearAmbiente, editarAmbiente, eliminarAmbiente } = require('../Controllers/Ambientes');

router.get('/ambientes', mostrarAmbientes);
router.get('/ambientes/:id', mostrarAmbiente);
router.post('/ambientes', crearAmbiente);
router.put('/ambientes/:id', editarAmbiente);
router.delete('/ambientes/:id', eliminarAmbiente);

module.exports = router;
