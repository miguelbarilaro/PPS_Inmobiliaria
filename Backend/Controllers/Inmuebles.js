const { connection } = require('../Config/database');


// ---------------------------------------------------
// 📌 MOSTRAR TODOS LOS INMUEBLES (con provincia, depto, municipio)
// ---------------------------------------------------
const mostrarInmuebles = (req, res) => {
    const query = `
        SELECT i.*, 

               ti.tipo_inmueble,
               am.numero AS numero_ambientes,
               d.numero AS numero_dormitorios,
               con.estado AS condicion,
               e.numero AS numero_estacionamiento,
               e.entrada_exclusiva,

               dir.calle,
               dir.numero AS numero_direccion,
               dir.ubicacion,

               mun.id_municipio,
               mun.nombre AS municipio,

               dep.id_departamento,
               dep.nombre AS departamento,

               prov.id_provincia,
               prov.nombre AS provincia,

               cl.tipo AS tipo_cliente

        FROM Inmuebles i
        LEFT JOIN Categorias c ON i.id_categoria = c.id_categoria
        /* no state in Inmuebles - state is tracked in Publicaciones */
        LEFT JOIN Tipo_Inmuebles ti ON i.id_tipo_inmueble = ti.id_tipo_inmueble
        LEFT JOIN Ambientes am ON i.id_ambiente = am.id_ambiente
        LEFT JOIN Dormitorios d ON i.id_dormitorio = d.id_dormitorio
        LEFT JOIN Condiciones con ON i.id_condicion = con.id_condicion
        LEFT JOIN Estacionamientos e ON i.id_estacionamiento = e.id_estacionamiento
        
        LEFT JOIN Direcciones dir ON i.id_direccion = dir.id_direccion
        LEFT JOIN Municipios mun ON dir.id_municipio = mun.id_municipio
        LEFT JOIN Departamentos dep ON mun.id_departamento = dep.id_departamento
        LEFT JOIN Provincias prov ON dep.id_provincia = prov.id_provincia

        LEFT JOIN Clientes cl ON i.id_cliente = cl.id_cliente
    `;

    connection.query(query, (error, results) => {
        if (error) {
            console.error("Error al obtener inmuebles:", error);
            return res.status(500).json({ message: "Error al obtener los inmuebles" });
        }
        res.json(results);
    });
};



// ---------------------------------------------------
// 📌 MOSTRAR UN INMUEBLE POR ID
// ---------------------------------------------------
const mostrarInmueble = (req, res) => {
    const id = req.params.id;

    const query = `
        SELECT i.*, 

               c.nombre AS categoria,
               ti.tipo_inmueble,
               am.numero AS numero_ambientes,
               d.numero AS numero_dormitorios,
               con.estado AS condicion,
               e.numero AS numero_estacionamiento,
               e.entrada_exclusiva,

               dir.calle,
               dir.numero AS numero_direccion,
               dir.ubicacion,

               mun.id_municipio,
               mun.nombre AS municipio,

               dep.id_departamento,
               dep.nombre AS departamento,

               prov.id_provincia,
               prov.nombre AS provincia,

               cl.tipo AS tipo_cliente

        FROM Inmuebles i
        LEFT JOIN Categorias c ON i.id_categoria = c.id_categoria
        LEFT JOIN Tipo_Inmuebles ti ON i.id_tipo_inmueble = ti.id_tipo_inmueble
        LEFT JOIN Ambientes am ON i.id_ambiente = am.id_ambiente
        LEFT JOIN Dormitorios d ON i.id_dormitorio = d.id_dormitorio
        LEFT JOIN Condiciones con ON i.id_condicion = con.id_condicion
        LEFT JOIN Estacionamientos e ON i.id_estacionamiento = e.id_estacionamiento

        LEFT JOIN Direcciones dir ON i.id_direccion = dir.id_direccion
        LEFT JOIN Municipios mun ON dir.id_municipio = mun.id_municipio
        LEFT JOIN Departamentos dep ON mun.id_departamento = dep.id_departamento
        LEFT JOIN Provincias prov ON dep.id_provincia = prov.id_provincia

        LEFT JOIN Clientes cl ON i.id_cliente = cl.id_cliente

        WHERE i.id_inmueble = ?
    `;

    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error("Error al obtener el inmueble:", error);
            return res.status(500).json({ message: "Error al obtener el inmueble" });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Inmueble no encontrado" });
        }
        res.json(results[0]);
    });
};




// ---------------------------------------------------
// 📌 CREAR INMUEBLE
// ---------------------------------------------------
const crearInmueble = (req, res) => {
        const { 
            titulo, descripcion, pileta, terraza, 
            id_categoria, id_condicion, id_direccion
        } = req.body;
    
        if (!titulo || !descripcion) {
            return res.status(400).json({ message: "Título y descripción son requeridos" });
        }
  
        const query = `
            INSERT INTO Inmuebles (
                titulo, descripcion, pileta, terraza,
                id_categoria, id_condicion, id_direccion
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
  
        connection.query(
            query,
            [
                titulo,
                descripcion,
                pileta ? "sí" : "no",
                terraza ? "sí" : "no",
                id_categoria || null,
                id_condicion || null,
                id_direccion || null
            ],
            (error, results) => {
                if (error) {
                    console.error("❌ Error al crear inmueble:", error);
                    return res.status(500).json({ message: "Error al crear inmueble" });
                }

                res.status(201).json({
                    id: results.insertId,
                    message: "Inmueble creado exitosamente"
                });
            }
        );
    };
  



// ---------------------------------------------------
// 📌 EDITAR INMUEBLE
// ---------------------------------------------------
const editarInmueble = (req, res) => {
    const id = req.params.id;
    const { 
        titulo, descripcion, pileta, terraza,
        id_categoria, id_tipo_inmueble,
        id_ambiente, id_dormitorio, id_condicion,
        id_estacionamiento, id_direccion, id_cliente
    } = req.body;

    const query = `
        UPDATE Inmuebles SET
            titulo = ?, descripcion = ?, pileta = ?, terraza = ?,
            id_categoria = ?, id_tipo_inmueble = ?,
            id_ambiente = ?, id_dormitorio = ?, id_condicion = ?,
            id_estacionamiento = ?, id_direccion = ?, id_cliente = ?
        WHERE id_inmueble = ?
    `;

    connection.query(query, [
        titulo, descripcion, pileta, terraza,
        id_categoria, id_tipo_inmueble,
        id_ambiente, id_dormitorio, id_condicion,
        id_estacionamiento, id_direccion, id_cliente,
        id
    ], (error, results) => {
        if (error) {
            console.error("Error al editar inmueble:", error);
            return res.status(500).json({ message: "Error al editar inmueble" });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Inmueble no encontrado" });
        }

        res.json({ message: "Inmueble actualizado exitosamente" });
    });
};




// ---------------------------------------------------
// 📌 ELIMINAR INMUEBLE
// ---------------------------------------------------
const eliminarInmueble = (req, res) => {
    const id = req.params.id;

    connection.query('DELETE FROM Inmuebles WHERE id_inmueble = ?', [id], (error, results) => {
        if (error) {
            console.error("Error al eliminar inmueble:", error);
            return res.status(500).json({ message: "Error al eliminar inmueble" });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Inmueble no encontrado" });
        }
        res.json({ message: "Inmueble eliminado correctamente" });
    });
};




// Note: Approval/rejection and state (Autorizadas) are managed on Publicaciones




// ---------------------------------------------------
module.exports = {
    mostrarInmuebles,
    mostrarInmueble,
    crearInmueble,
    editarInmueble,
    eliminarInmueble
};
