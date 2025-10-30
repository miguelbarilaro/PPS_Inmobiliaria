const express = require('express');
const router = express.Router();

const { mostrarCitas, mostrarCita, crearCita, editarCita, eliminarCita } = require('../Controllers/Citas');

router.get('/citas', mostrarCitas);
router.get('/citas/:id', mostrarCita);
router.post('/citas', crearCita);
router.put('/citas/:id', editarCita);
router.delete('/citas/:id', eliminarCita);

module.exports = router;
