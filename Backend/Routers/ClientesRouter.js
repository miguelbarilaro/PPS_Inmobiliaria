const express = require('express');
const router = express.Router();

const { mostrarClientes, mostrarCliente, crearCliente, editarCliente, eliminarCliente } = require('../Controllers/Clientes');

router.get('/clientes', mostrarClientes);
router.get('/clientes/:id', mostrarCliente);
router.post('/clientes', crearCliente);
router.put('/clientes/:id', editarCliente);
router.delete('/clientes/:id', eliminarCliente);

module.exports = router;
