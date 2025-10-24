const express = require ("express")
const mysql = require ("mysql2")
const cors = require ("cors")

const app = express()

//Habilita CORS
app.use(cors())

app.use(express.json())



app.get("/", (req,res) => {
    res.send("API de la inmobiliaria")
})

app.listen(8000, () => {
    console.log("Servidor corriendo en el puerto 8000")
})