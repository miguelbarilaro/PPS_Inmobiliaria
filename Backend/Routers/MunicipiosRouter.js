const express = require('express');
const router = express.Router();

const { mostrarMunicipios, mostrarMunicipio, crearMunicipio, editarMunicipio, eliminarMunicipio } = require('../Controllers/Municipios');

router.get('/municipios', mostrarMunicipios);
router.get('/municipios/:id', mostrarMunicipio);
router.post('/municipios', crearMunicipio);
router.put('/municipios/:id', editarMunicipio);
router.delete('/municipios/:id', eliminarMunicipio);

module.exports = router;
