require('dotenv').config(); // Carga variables de entorno desde el archivo .env

const express = require('express'); // Importa Express para crear el servidor
const path = require('path');
const db = require("./db2"); // Conexión a la base de datos
const cors = require("cors"); // Habilita peticiones desde otros dominios (frontend)
const WebSocket = require('ws'); //websocket

const app = express(); // Inicializa la aplicación backend
const port = 3000; // Puerto donde correrá el servidor

//middleware
app.use(express.json()); // ← necesario para leer JSON
app.use(cors()); // habilita CORS para todas las rutas



app.get("/api/textos", listaTextos); // Endpoint para obtener todos los textos desde la base de datos
app.post("/api/textos", async (req, res) => { // Endpoint para guardar un nuevo texto en la base de datos
  // try { 

  // Consulta SQL para insertar datos en la tabla texto
  const sqlQuery = "INSERT INTO texto (contenido, tipo, usuario) VALUES ($1, $2, $3) RETURNING *" // const sqlQuery = "INSERT INTO texto (contenido, tipo, usuario) VALUES (?, ?, ?)"

  // Datos enviados desde el frontend
  const contenido = req.body.contenido;
  const tipo = req.body.tipo;
  const usuario = req.body.usuario;
  const result = await db.query(sqlQuery, [contenido, tipo, usuario]) // Ejecuta la consulta en la base de datos
  // } catch (error) {
  //     console.error("Error al guardar:", error);

  //     res.status(500).json({
  //       error: "Error al guardar el registro"
  //     });
  //   }

  // 🔥 NOTIFICAR A TODOS LOS CLIENTES
  const evento = {
    tipo: "nuevo_registro",
    palabra: contenido,
    frase: tipo,
    usuario: usuario
  };

  console.log("Clientes ws" + wss.clients)
  wss.clients.forEach(client => {
    if (client.readyState === 1) { // WebSocket.OPEN
      console.log("Nuevo mensaje ws")

      client.send(JSON.stringify(evento));
    }
  });

  res.status(201).json(result.rows[0]); // Devuelve el registro creado
});

const server = app.listen(port, () => { // Inicia el servidor en el puerto definido
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

const wss = new WebSocket.Server({ server });

//CONEXION AL WEBSOCKET
wss.on('connection', (ws) => {
  console.log("Websocket conectado")
  ws.on('message', (message) => {
    console.log("Nuevo mensaje ws")
    const data = JSON.parse(message);

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });
});



async function listaTextos(req, res) { // Consulta todos los registros de la tabla texto y los devuelve como JSON

  const result = await db.query("SELECT * FROM texto")  // Ejecuta consulta SQL para obtener todos los textos
  res.json(result.rows);  // Devuelve los datos al frontend
}