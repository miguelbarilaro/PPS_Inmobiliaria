const { connection } = require('../Config/database');

// Obtener todos los usuarios
const mostrarUsuarios = (req, res) => {
    const query = `
        SELECT u.*, p.cuil, p.dni, p.fecha_nacimiento, p.edad,
               r.nombre_rol
        FROM Usuarios u 
        LEFT JOIN Personas p ON u.id_persona = p.id_persona
        LEFT JOIN Roles r ON u.id_rol = r.id_rol
    `;
    
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener los usuarios:', error);
            return res.status(500).json({ message: 'Error al obtener los usuarios' });
        }
        res.json(results);
    });
};

// Obtener un usuario por ID
const mostrarUsuario = (req, res) => {
    const id = req.params.id;
    const query = `
        SELECT u.*, p.cuil, p.dni, p.fecha_nacimiento, p.edad,
               r.nombre_rol
        FROM Usuarios u 
        LEFT JOIN Personas p ON u.id_persona = p.id_persona
        LEFT JOIN Roles r ON u.id_rol = r.id_rol
        WHERE u.id_usuario = ?
    `;
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al obtener el usuario:', error);
            return res.status(500).json({ message: 'Error al obtener el usuario' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(results[0]);
    });
};

// Crear un nuevo usuario
const crearUsuario = (req, res) => {
    const { email, contrasena, id_persona, id_rol } = req.body;
    const query = 'INSERT INTO Usuarios (email, contrasena, id_persona, id_rol) VALUES (?, ?, ?, ?)';
    
    connection.query(query, [email, contrasena, id_persona, id_rol], (error, results) => {
        if (error) {
            console.error('Error al crear el usuario:', error);
            return res.status(500).json({ message: 'Error al crear el usuario' });
        }
        res.status(201).json({ 
            id: results.insertId,
            message: 'Usuario creado exitosamente' 
        });
    });
};

// Actualizar un usuario
const editarUsuario = (req, res) => {
    const id = req.params.id;
    const { email, contrasena, id_persona, id_rol } = req.body;
    const query = 'UPDATE Usuarios SET email = ?, contrasena = ?, id_persona = ?, id_rol = ? WHERE id_usuario = ?';
    
    connection.query(query, [email, contrasena, id_persona, id_rol, id], (error, results) => {
        if (error) {
            console.error('Error al actualizar el usuario:', error);
            return res.status(500).json({ message: 'Error al actualizar el usuario' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario actualizado exitosamente' });
    });
};

// Eliminar un usuario
const eliminarUsuario = (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM Usuarios WHERE id_usuario = ?';
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar el usuario:', error);
            return res.status(500).json({ message: 'Error al eliminar el usuario' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado exitosamente' });
    });
};

module.exports = {
    mostrarUsuarios,
    mostrarUsuario,
    crearUsuario,
    editarUsuario,
    eliminarUsuario
};
