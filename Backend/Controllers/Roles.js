const { connection } = require('../Config/database');

// Obtener todos los roles
const mostrarRoles = (req, res) => {
    const query = 'SELECT * FROM Roles';
    
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener los roles:', error);
            return res.status(500).json({ message: 'Error al obtener los roles' });
        }
        res.json(results);
    });
};

// Obtener un rol por ID
const mostrarRol = (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM Roles WHERE id_rol = ?';
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al obtener el rol:', error);
            return res.status(500).json({ message: 'Error al obtener el rol' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }
        res.json(results[0]);
    });
};

// Crear un nuevo rol
const crearRol = (req, res) => {
    const { nombre_rol } = req.body;
    const query = 'INSERT INTO Roles (nombre_rol) VALUES (?)';
    
    connection.query(query, [nombre_rol], (error, results) => {
        if (error) {
            console.error('Error al crear el rol:', error);
            return res.status(500).json({ message: 'Error al crear el rol' });
        }
        res.status(201).json({ 
            id: results.insertId,
            message: 'Rol creado exitosamente' 
        });
    });
};

// Actualizar un rol
const editarRol = (req, res) => {
    const id = req.params.id;
    const { nombre_rol } = req.body;
    const query = 'UPDATE Roles SET nombre_rol = ? WHERE id_rol = ?';
    
    connection.query(query, [nombre_rol, id], (error, results) => {
        if (error) {
            console.error('Error al actualizar el rol:', error);
            return res.status(500).json({ message: 'Error al actualizar el rol' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }
        res.json({ message: 'Rol actualizado exitosamente' });
    });
};

// Eliminar un rol
const eliminarRol = (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM Roles WHERE id_rol = ?';
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar el rol:', error);
            return res.status(500).json({ message: 'Error al eliminar el rol' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }
        res.json({ message: 'Rol eliminado exitosamente' });
    });
};

module.exports = {
    mostrarRoles,
    mostrarRol,
    crearRol,
    editarRol,
    eliminarRol
};
