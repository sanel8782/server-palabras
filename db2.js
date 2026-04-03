const { Client } = require("pg");

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432, // importante
  ssl: {
    rejectUnauthorized: false, // necesario para Supabase
  },
});

client.connect()
  .then(() => {
    console.log("Conectado a PostgreSQL");
  })
  .catch((error) => {
    console.error("Error conectando:", error);
  });

module.exports = client;