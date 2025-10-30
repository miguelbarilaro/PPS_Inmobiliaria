const express = require('express');
const router = express.Router();

const { mostrarUsuarios, mostrarUsuario, crearUsuario, editarUsuario, eliminarUsuario } = require('../Controllers/Usuarios');

router.get('/usuarios', mostrarUsuarios);
router.get('/usuarios/:id', mostrarUsuario);
router.post('/usuarios', crearUsuario);
router.put('/usuarios/:id', editarUsuario);
router.delete('/usuarios/:id', eliminarUsuario);

module.exports = router;
