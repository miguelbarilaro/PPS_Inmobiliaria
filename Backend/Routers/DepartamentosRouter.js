const express = require('express');
const router = express.Router();

const { mostrarDepartamentos, mostrarDepartamento, crearDepartamento, editarDepartamento, eliminarDepartamento } = require('../Controllers/Departamentos');

router.get('/departamentos', mostrarDepartamentos);
router.get('/departamentos/:id', mostrarDepartamento);
router.post('/departamentos', crearDepartamento);
router.put('/departamentos/:id', editarDepartamento);
router.delete('/departamentos/:id', eliminarDepartamento);

module.exports = router;
