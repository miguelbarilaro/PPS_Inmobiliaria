const express = require('express');
const router = express.Router();


const { mostrarCategorias,
    mostrarCategoria,
    crearCategoria,
    editarCategoria,
    eliminarCategoria } = require('../Controllers/Categorias');



router.get("/categorias", mostrarCategorias);
router.get("/categorias/:id", mostrarCategoria);
router.post("/categorias", crearCategoria);
router.put("/categorias/:id", editarCategoria);
router.delete("/categorias/:id", eliminarCategoria);

module.exports = router;