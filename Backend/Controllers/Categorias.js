const { connection } = require('../Config/database');

// Obtener todas las categorías
const mostrarCategorias = (req, res) => {
    const query = 'SELECT * FROM Categorias';
    
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener las categorías:', error);
            return res.status(500).json({ message: 'Error al obtener las categorías' });
        }
        res.json(results);
    });
};

// Obtener una categoría por ID
const mostrarCategoria = (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM Categorias WHERE id_categoria = ?';
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al obtener la categoría:', error);
            return res.status(500).json({ message: 'Error al obtener la categoría' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.json(results[0]);
    });
};

// Crear una nueva categoría
const crearCategoria = (req, res) => {
    const { nombre } = req.body;
    const query = 'INSERT INTO Categorias (nombre) VALUES (?)';
    
    connection.query(query, [nombre], (error, results) => {
        if (error) {
            console.error('Error al crear la categoría:', error);
            return res.status(500).json({ message: 'Error al crear la categoría' });
        }
        res.status(201).json({ 
            id: results.insertId,
            message: 'Categoría creada exitosamente' 
        });
    });
};

// Actualizar una categoría
const editarCategoria = (req, res) => {
    const id = req.params.id;
    const { nombre } = req.body;
    const query = 'UPDATE Categorias SET nombre = ? WHERE id_categoria = ?';
    
    connection.query(query, [nombre, id], (error, results) => {
        if (error) {
            console.error('Error al actualizar la categoría:', error);
            return res.status(500).json({ message: 'Error al actualizar la categoría' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.json({ message: 'Categoría actualizada exitosamente' });
    });
};

// Eliminar una categoría
const eliminarCategoria = (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM Categorias WHERE id_categoria = ?';
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar la categoría:', error);
            return res.status(500).json({ message: 'Error al eliminar la categoría' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.json({ message: 'Categoría eliminada exitosamente' });
    });
};

module.exports = {
    mostrarCategorias,
    mostrarCategoria,
    crearCategoria,
    editarCategoria,
    eliminarCategoria
};
