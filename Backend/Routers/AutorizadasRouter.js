const express = require('express');
const router = express.Router();

const { mostrarAutorizadas, mostrarAutorizada, crearAutorizada, editarAutorizada, eliminarAutorizada } = require('../Controllers/Autorizadas');

router.get('/autorizadas', mostrarAutorizadas);
router.get('/autorizadas/:id', mostrarAutorizada);
router.post('/autorizadas', crearAutorizada);
router.put('/autorizadas/:id', editarAutorizada);
router.delete('/autorizadas/:id', eliminarAutorizada);

module.exports = router;
