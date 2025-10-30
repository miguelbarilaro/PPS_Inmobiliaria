const express = require('express');
const router = express.Router();

const { mostrarDormitorios, mostrarDormitorio, crearDormitorio, editarDormitorio, eliminarDormitorio } = require('../Controllers/Dormitorios');

router.get('/dormitorios', mostrarDormitorios);
router.get('/dormitorios/:id', mostrarDormitorio);
router.post('/dormitorios', crearDormitorio);
router.put('/dormitorios/:id', editarDormitorio);
router.delete('/dormitorios/:id', eliminarDormitorio);

module.exports = router;
