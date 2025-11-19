const express = require('express');
const router = express.Router();

const { 
  mostrarInmuebles,
  mostrarInmueble,
  crearInmueble,
  editarInmueble,
  eliminarInmueble
} = require('../Controllers/Inmuebles');

router.get('/inmuebles', mostrarInmuebles);
router.get('/inmuebles/:id', mostrarInmueble);
router.post('/inmuebles', crearInmueble);
router.put('/inmuebles/:id', editarInmueble);
router.delete('/inmuebles/:id', eliminarInmueble);

module.exports = router;
