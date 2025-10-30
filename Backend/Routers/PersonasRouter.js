const express = require('express');
const router = express.Router();

const { mostrarPersonas, mostrarPersona, crearPersona, editarPersona, eliminarPersona } = require('../Controllers/Personas');

router.get('/personas', mostrarPersonas);
router.get('/personas/:id', mostrarPersona);
router.post('/personas', crearPersona);
router.put('/personas/:id', editarPersona);
router.delete('/personas/:id', eliminarPersona);

module.exports = router;
