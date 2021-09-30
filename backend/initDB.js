const mysql = require("mysql");
const dbConfig = require("./config/db.config");

//Connexion Base de donnée
const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
});

connection.connect((error) => {
  if (error) throw error;
  console.log("Connexion à la Base de donnée reussite");
});

module.exports = connection;
//**************************//