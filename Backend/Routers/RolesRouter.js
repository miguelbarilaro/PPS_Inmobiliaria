const express = require('express');
const router = express.Router();

const { mostrarRoles, mostrarRol, crearRol, editarRol, eliminarRol } = require('../Controllers/Roles');

router.get('/roles', mostrarRoles);
router.get('/roles/:id', mostrarRol);
router.post('/roles', crearRol);
router.put('/roles/:id', editarRol);
router.delete('/roles/:id', eliminarRol);

module.exports = router;
