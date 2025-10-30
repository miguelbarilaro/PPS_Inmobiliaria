const { connection } = require('../Config/database');

// Obtener todos los clientes
const mostrarClientes = (req, res) => {
    const query = `
        SELECT c.*, u.email, u.contrasena,
               p.cuil, p.dni, p.fecha_nacimiento, p.edad
        FROM Clientes c
        LEFT JOIN Usuarios u ON c.id_usuario = u.id_usuario
        LEFT JOIN Personas p ON u.id_persona = p.id_persona
    `;
    
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener los clientes:', error);
            return res.status(500).json({ message: 'Error al obtener los clientes' });
        }
        res.json(results);
    });
};

// Obtener un cliente por ID
const mostrarCliente = (req, res) => {
    const id = req.params.id;
    const query = `
        SELECT c.*, u.email, u.contrasena,
               p.cuil, p.dni, p.fecha_nacimiento, p.edad
        FROM Clientes c
        LEFT JOIN Usuarios u ON c.id_usuario = u.id_usuario
        LEFT JOIN Personas p ON u.id_persona = p.id_persona
        WHERE c.id_cliente = ?
    `;
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al obtener el cliente:', error);
            return res.status(500).json({ message: 'Error al obtener el cliente' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json(results[0]);
    });
};

// Crear un nuevo cliente
const crearCliente = (req, res) => {
    const { tipo, categoria_fiscal, id_usuario } = req.body;
    const query = 'INSERT INTO Clientes (tipo, categoria_fiscal, id_usuario) VALUES (?, ?, ?)';
    
    connection.query(query, [tipo, categoria_fiscal, id_usuario], (error, results) => {
        if (error) {
            console.error('Error al crear el cliente:', error);
            return res.status(500).json({ message: 'Error al crear el cliente' });
        }
        res.status(201).json({ 
            id: results.insertId,
            message: 'Cliente creado exitosamente' 
        });
    });
};

// Actualizar un cliente
const editarCliente = (req, res) => {
    const id = req.params.id;
    const { tipo, categoria_fiscal, id_usuario } = req.body;
    const query = 'UPDATE Clientes SET tipo = ?, categoria_fiscal = ?, id_usuario = ? WHERE id_cliente = ?';
    
    connection.query(query, [tipo, categoria_fiscal, id_usuario, id], (error, results) => {
        if (error) {
            console.error('Error al actualizar el cliente:', error);
            return res.status(500).json({ message: 'Error al actualizar el cliente' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json({ message: 'Cliente actualizado exitosamente' });
    });
};

// Eliminar un cliente
const eliminarCliente = (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM Clientes WHERE id_cliente = ?';
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar el cliente:', error);
            return res.status(500).json({ message: 'Error al eliminar el cliente' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json({ message: 'Cliente eliminado exitosamente' });
    });
};

module.exports = {
    mostrarClientes,
    mostrarCliente,
    crearCliente,
    editarCliente,
    eliminarCliente
};
