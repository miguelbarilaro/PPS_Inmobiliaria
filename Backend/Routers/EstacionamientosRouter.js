const express = require('express');
const router = express.Router();

const { mostrarEstacionamientos, mostrarEstacionamiento, crearEstacionamiento, editarEstacionamiento, eliminarEstacionamiento } = require('../Controllers/Estacionamientos');

router.get('/estacionamientos', mostrarEstacionamientos);
router.get('/estacionamientos/:id', mostrarEstacionamiento);
router.post('/estacionamientos', crearEstacionamiento);
router.put('/estacionamientos/:id', editarEstacionamiento);
router.delete('/estacionamientos/:id', eliminarEstacionamiento);

module.exports = router;
