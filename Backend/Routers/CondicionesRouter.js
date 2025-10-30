const express = require('express');
const router = express.Router();

const { mostrarCondiciones, mostrarCondicion, crearCondicion, editarCondicion, eliminarCondicion } = require('../Controllers/Condiciones');

router.get('/condiciones', mostrarCondiciones);
router.get('/condiciones/:id', mostrarCondicion);
router.post('/condiciones', crearCondicion);
router.put('/condiciones/:id', editarCondicion);
router.delete('/condiciones/:id', eliminarCondicion);

module.exports = router;
