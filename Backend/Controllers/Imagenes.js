const { connection } = require("../Config/database");

/* ===========================
   MOSTRAR TODAS LAS IMÁGENES
=========================== */
const mostrarImagenes = (req, res) => {
  // Si viene id_publicacion en query, filtrar por él
  const idPublicacion = req.query.id_publicacion;

  let query = "SELECT * FROM Imagenes";
  let params = [];

  if (idPublicacion) {
    query += " WHERE id_publicacion = ?";
    params = [idPublicacion];
  }

  query += " ORDER BY orden ASC";

  connection.query(query, params, (err, results) => {
    if (err) {
      console.error("Error al obtener imágenes:", err);
      return res.status(500).json({ message: "Error al obtener imágenes" });
    }
    res.json(results);
  });
};

/* ===========================
   MOSTRAR UNA IMAGEN POR ID
=========================== */
const mostrarImagen = (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM Imagenes WHERE id_imagen = ?";

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error al obtener imagen:", err);
      return res.status(500).json({ message: "Error al obtener imagen" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }
    res.json(results[0]);
  });
};

/* ===========================
       CREAR IMAGEN
=========================== */
const crearImagen = (req, res) => {
  const { nombre, url, orden, id_publicacion } = req.body;

  const query = `
    INSERT INTO Imagenes (nombre, url, orden, id_publicacion)
    VALUES (?, ?, ?, ?)
  `;

  connection.query(
    query,
    [nombre, url, orden, id_publicacion],
    (err, results) => {
      if (err) {
        console.error("Error al crear imagen:", err);
        return res.status(500).json({ message: "Error al crear imagen" });
      }
      res.json({
        id: results.insertId,
        message: "Imagen creada correctamente",
      });
    }
  );
};

/* ===========================
       ELIMINAR IMAGEN
=========================== */
const eliminarImagen = (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM Imagenes WHERE id_imagen = ?";

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error al eliminar imagen:", err);
      return res.status(500).json({ message: "Error al eliminar imagen" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }

    res.json({ message: "Imagen eliminada correctamente" });
  });
};

/* ===========================
   OBTENER IMÁGENES POR PUBLICACIÓN
=========================== */
const obtenerImagenesPorPublicacion = (req, res) => {
  const id = req.params.id;

  const query = `
    SELECT *
    FROM Imagenes
    WHERE id_publicacion = ?
    ORDER BY orden ASC
  `;

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error al obtener imágenes:", err);
      return res.status(500).json({ message: "Error al obtener imágenes" });
    }
    res.json(results);
  });
};

/* ===========================
        EXPORTS CORRECTO
=========================== */
module.exports = {
  mostrarImagenes,
  mostrarImagen,
  crearImagen,
  eliminarImagen,
  obtenerImagenesPorPublicacion, // ← ACÁ ESTÁ BIEN
};
