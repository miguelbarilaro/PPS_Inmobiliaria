const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post("/upload", upload.array("imagenes"), (req, res) => {
  const files = req.files.map(file => ({
    nombre: file.filename,
    url: `http://localhost:8000/uploads/${file.filename}`
  }));

  res.json({
    success: true,
    message: "Imágenes cargadas",
    files
  });
});

module.exports = router;
