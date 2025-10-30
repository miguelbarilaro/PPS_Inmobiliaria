const express = require('express');
const router = express.Router();

const { mostrarTipoInmuebles, mostrarTipoInmueble, crearTipoInmueble, editarTipoInmueble, eliminarTipoInmueble } = require('../Controllers/Tipoinmuebles');

router.get('/tipoinmuebles', mostrarTipoInmuebles);
router.get('/tipoinmuebles/:id', mostrarTipoInmueble);
router.post('/tipoinmuebles', crearTipoInmueble);
router.put('/tipoinmuebles/:id', editarTipoInmueble);
router.delete('/tipoinmuebles/:id', eliminarTipoInmueble);

module.exports = router;
