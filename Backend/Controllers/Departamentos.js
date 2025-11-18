const { connection } = require('../Config/database');

// Obtener todos los departamentos
const mostrarDepartamentos = (req, res) => {
    const query = `
        SELECT 
            d.id_departamento,
            d.nombre,
            d.id_provincia,
            p.nombre AS nombre_provincia
        FROM Departamentos d
        LEFT JOIN Provincias p ON d.id_provincia = p.id_provincia
    `;

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener los departamentos:', error);
            return res.status(500).json({ message: 'Error al obtener los departamentos' });
        }
        res.json(results);
    });
};

// Obtener un departamento por ID
const mostrarDepartamento = (req, res) => {
    const id = req.params.id;

    const query = `
        SELECT 
            d.id_departamento,
            d.nombre,
            d.id_provincia,
            p.nombre AS nombre_provincia
        FROM Departamentos d
        LEFT JOIN Provincias p ON d.id_provincia = p.id_provincia
        WHERE d.id_departamento = ?
    `;

    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al obtener el departamento:', error);
            return res.status(500).json({ message: 'Error al obtener el departamento' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Departamento no encontrado' });
        }
        res.json(results[0]);
    });
};

// Crear un nuevo departamento
const crearDepartamento = (req, res) => {
    const { nombre, id_provincia } = req.body;
    const query = 'INSERT INTO Departamentos (nombre, id_provincia) VALUES (?, ?)';

    connection.query(query, [nombre, id_provincia], (error, results) => {
        if (error) {
            console.error('Error al crear el departamento:', error);
            return res.status(500).json({ message: 'Error al crear el departamento' });
        }
        res.status(201).json({
            id: results.insertId,
            message: 'Departamento creado exitosamente'
        });
    });
};

// Actualizar un departamento
const editarDepartamento = (req, res) => {
    const id = req.params.id;
    const { nombre, id_provincia } = req.body;

    const query = 'UPDATE Departamentos SET nombre = ?, id_provincia = ? WHERE id_departamento = ?';

    connection.query(query, [nombre, id_provincia, id], (error, results) => {
        if (error) {
            console.error('Error al actualizar el departamento:', error);
            return res.status(500).json({ message: 'Error al actualizar el departamento' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Departamento no encontrado' });
        }
        res.json({ message: 'Departamento actualizado exitosamente' });
    });
};

// Eliminar un departamento
const eliminarDepartamento = (req, res) => {
    const id = req.params.id;

    const query = 'DELETE FROM Departamentos WHERE id_departamento = ?';

    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar el departamento:', error);
            return res.status(500).json({ message: 'Error al eliminar el departamento' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Departamento no encontrado' });
        }
        res.json({ message: 'Departamento eliminado exitosamente' });
    });
};

module.exports = {
    mostrarDepartamentos,
    mostrarDepartamento,
    crearDepartamento,
    editarDepartamento,
    eliminarDepartamento
};
