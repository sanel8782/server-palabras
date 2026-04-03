require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require("./db2")
const cors = require("cors");


const app = express();
const port = 3000;

//middleware
app.use(express.json()); // ← necesario para leer JSON

app.use(cors()); // habilita CORS para todas las rutas

//recuperando todos lo registro de la tabla texto
app.get("/api/textos", listaTextos);


//insertando un registro en la tabla texto
app.post("/api/textos", async (req, res) => {

  const sqlQuery = "INSERT INTO texto (contenido, tipo) VALUES ($1, $2) RETURNING *"
  const contenido = req.body.contenido;
  const tipo = req.body.tipo;

  const result = await db.query(sqlQuery, [contenido, tipo])
  res.status(201).json(result.rows[0]); // 🔥 clave

});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});



async function listaTextos(req, res) {

  const result = await db.query("SELECT * FROM texto")
  res.json(result.rows);

}