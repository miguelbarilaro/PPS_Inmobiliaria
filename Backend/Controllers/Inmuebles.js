const { connection } = require('../Config/database');

// Obtener todos los inmuebles
const mostrarInmuebles = (req, res) => {
    const query = `
        SELECT i.*, c.nombre as categoria, a.autorizada,
               ti.tipo_inmueble, am.numero as numero_ambientes,
               d.numero as numero_dormitorios, con.estado as condicion,
               e.numero as numero_estacionamiento, e.entrada_exclusiva,
               dir.calle, dir.numero as numero_direccion, dir.ubicacion,
               cl.tipo as tipo_cliente
        FROM Inmuebles i
        LEFT JOIN Categorias c ON i.id_categoria = c.id_categoria
        LEFT JOIN Autorizadas a ON i.id_autorizada = a.id_autorizada
        LEFT JOIN Tipo_Inmuebles ti ON i.id_tipo_inmueble = ti.id_tipo_inmueble
        LEFT JOIN Ambientes am ON i.id_ambiente = am.id_ambiente
        LEFT JOIN Dormitorios d ON i.id_dormitorio = d.id_dormitorio
        LEFT JOIN Condiciones con ON i.id_condicion = con.id_condicion
        LEFT JOIN Estacionamientos e ON i.id_estacionamiento = e.id_estacionamiento
        LEFT JOIN Direcciones dir ON i.id_direccion = dir.id_direccion
        LEFT JOIN Clientes cl ON i.id_cliente = cl.id_cliente
    `;
    
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener los inmuebles:', error);
            return res.status(500).json({ message: 'Error al obtener los inmuebles' });
        }
        res.json(results);
    });
};

// Obtener un inmueble por ID
const mostrarInmueble = (req, res) => {
    const id = req.params.id;
    const query = `
        SELECT i.*, c.nombre as categoria, a.autorizada,
               ti.tipo_inmueble, am.numero as numero_ambientes,
               d.numero as numero_dormitorios, con.estado as condicion,
               e.numero as numero_estacionamiento, e.entrada_exclusiva,
               dir.calle, dir.numero as numero_direccion, dir.ubicacion,
               cl.tipo as tipo_cliente
        FROM Inmuebles i
        LEFT JOIN Categorias c ON i.id_categoria = c.id_categoria
        LEFT JOIN Autorizadas a ON i.id_autorizada = a.id_autorizada
        LEFT JOIN Tipo_Inmuebles ti ON i.id_tipo_inmueble = ti.id_tipo_inmueble
        LEFT JOIN Ambientes am ON i.id_ambiente = am.id_ambiente
        LEFT JOIN Dormitorios d ON i.id_dormitorio = d.id_dormitorio
        LEFT JOIN Condiciones con ON i.id_condicion = con.id_condicion
        LEFT JOIN Estacionamientos e ON i.id_estacionamiento = e.id_estacionamiento
        LEFT JOIN Direcciones dir ON i.id_direccion = dir.id_direccion
        LEFT JOIN Clientes cl ON i.id_cliente = cl.id_cliente
        WHERE i.id_inmueble = ?
    `;
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al obtener el inmueble:', error);
            return res.status(500).json({ message: 'Error al obtener el inmueble' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Inmueble no encontrado' });
        }
        res.json(results[0]);
    });
};

// Crear un nuevo inmueble
const crearInmueble = (req, res) => {
    const { 
        titulo, descripcion, pileta, terraza, 
        id_categoria, id_autorizada, id_tipo_inmueble,
        id_ambiente, id_dormitorio, id_condicion,
        id_estacionamiento, id_direccion, id_cliente 
    } = req.body;
    
    const query = `
        INSERT INTO Inmuebles (
            titulo, descripcion, pileta, terraza,
            id_categoria, id_autorizada, id_tipo_inmueble,
            id_ambiente, id_dormitorio, id_condicion,
            id_estacionamiento, id_direccion, id_cliente
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    connection.query(query, [
        titulo, descripcion, pileta, terraza,
        id_categoria, id_autorizada, id_tipo_inmueble,
        id_ambiente, id_dormitorio, id_condicion,
        id_estacionamiento, id_direccion, id_cliente
    ], (error, results) => {
        if (error) {
            console.error('Error al crear el inmueble:', error);
            return res.status(500).json({ message: 'Error al crear el inmueble' });
        }
        res.status(201).json({ 
            id: results.insertId,
            message: 'Inmueble creado exitosamente' 
        });
    });
};

// Actualizar un inmueble
const editarInmueble = (req, res) => {
    const id = req.params.id;
    const { 
        titulo, descripcion, pileta, terraza, 
        id_categoria, id_autorizada, id_tipo_inmueble,
        id_ambiente, id_dormitorio, id_condicion,
        id_estacionamiento, id_direccion, id_cliente 
    } = req.body;
    
    const query = `
        UPDATE Inmuebles SET 
            titulo = ?, descripcion = ?, pileta = ?, terraza = ?,
            id_categoria = ?, id_autorizada = ?, id_tipo_inmueble = ?,
            id_ambiente = ?, id_dormitorio = ?, id_condicion = ?,
            id_estacionamiento = ?, id_direccion = ?, id_cliente = ?
        WHERE id_inmueble = ?
    `;
    
    connection.query(query, [
        titulo, descripcion, pileta, terraza,
        id_categoria, id_autorizada, id_tipo_inmueble,
        id_ambiente, id_dormitorio, id_condicion,
        id_estacionamiento, id_direccion, id_cliente,
        id
    ], (error, results) => {
        if (error) {
            console.error('Error al actualizar el inmueble:', error);
            return res.status(500).json({ message: 'Error al actualizar el inmueble' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Inmueble no encontrado' });
        }
        res.json({ message: 'Inmueble actualizado exitosamente' });
    });
};

// Eliminar un inmueble
const eliminarInmueble = (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM Inmuebles WHERE id_inmueble = ?';
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar el inmueble:', error);
            return res.status(500).json({ message: 'Error al eliminar el inmueble' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Inmueble no encontrado' });
        }
        res.json({ message: 'Inmueble eliminado exitosamente' });
    });
};

module.exports = {
    mostrarInmuebles,
    mostrarInmueble,
    crearInmueble,
    editarInmueble,
    eliminarInmueble
};
