const { connection } = require('../Config/database');

// Obtener todos los dormitorios
const mostrarDormitorios = (req, res) => {
    const query = 'SELECT * FROM Dormitorios';
    
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener los dormitorios:', error);
            return res.status(500).json({ message: 'Error al obtener los dormitorios' });
        }
        res.json(results);
    });
};

// Obtener un dormitorio por ID
const mostrarDormitorio = (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM Dormitorios WHERE id_dormitorio = ?';
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al obtener el dormitorio:', error);
            return res.status(500).json({ message: 'Error al obtener el dormitorio' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Dormitorio no encontrado' });
        }
        res.json(results[0]);
    });
};

// Crear un nuevo dormitorio
const crearDormitorio = (req, res) => {
    const { numero } = req.body;
    const query = 'INSERT INTO Dormitorios (numero) VALUES (?)';
    
    connection.query(query, [numero], (error, results) => {
        if (error) {
            console.error('Error al crear el dormitorio:', error);
            return res.status(500).json({ message: 'Error al crear el dormitorio' });
        }
        res.status(201).json({ 
            id: results.insertId,
            message: 'Dormitorio creado exitosamente' 
        });
    });
};

// Actualizar un dormitorio
const editarDormitorio = (req, res) => {
    const id = req.params.id;
    const { numero } = req.body;
    const query = 'UPDATE Dormitorios SET numero = ? WHERE id_dormitorio = ?';
    
    connection.query(query, [numero, id], (error, results) => {
        if (error) {
            console.error('Error al actualizar el dormitorio:', error);
            return res.status(500).json({ message: 'Error al actualizar el dormitorio' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Dormitorio no encontrado' });
        }
        res.json({ message: 'Dormitorio actualizado exitosamente' });
    });
};

// Eliminar un dormitorio
const eliminarDormitorio = (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM Dormitorios WHERE id_dormitorio = ?';
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar el dormitorio:', error);
            return res.status(500).json({ message: 'Error al eliminar el dormitorio' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Dormitorio no encontrado' });
        }
        res.json({ message: 'Dormitorio eliminado exitosamente' });
    });
};

module.exports = {
    mostrarDormitorios,
    mostrarDormitorio,
    crearDormitorio,
    editarDormitorio,
    eliminarDormitorio
};
