require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require("./db")
const cors = require("cors");


const app = express();
const port = 3000;

//middleware
app.use(express.json()); // ← necesario para leer JSON

app.use(cors()); // habilita CORS para todas las rutas

//recuperando todos lo registro de la tabla texto
app.get("/api/textos", listaTextos);


//insertando un registro en la tabla texto
app.post("/api/textos", (req, res) => {

  const sqlQuery = "INSERT INTO texto (contenido, tipo) VALUES (?, ?)";
  const contenido = req.body.contenido;
  const tipo = req.body.tipo;

  db.query(sqlQuery, [contenido, tipo], (error, resultado) => {

    if (error) {
      console.error("Error al insertar:", error);
      return;
    }

    console.log("Registro insertado");
    console.log("ID generado:", resultado.insertId);

  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});



function listaTextos(req, res) {
    db.query("SELECT * FROM texto", (error, resultados) => {

      if (error) {
        console.error(error);
        return;
      }

      console.log(resultados);
      res.json(resultados);
    });
  }