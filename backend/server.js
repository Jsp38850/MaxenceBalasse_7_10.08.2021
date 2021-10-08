//Création Serveur
const http = require("http"); //utilisation de http pour transférer des données via le protocole de transfert hypertexte
const app = require("./app"); //Import app.js
const db = require("./initDB"); //

/***Normaliser un port pour s'assurer que le port fourni est un nombre sinon définir en false.***/
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

/***Réglage du port à 3000 ***/
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/***Traitement des erreurs en cas de dysfonctionnement ***/
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Utilisation de app.js pour importer les informations de l'application
const server = http.createServer(app);

//Erreur en cas de problème lors du démarrage du serveur
server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

server.listen(port);
