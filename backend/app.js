const express = require("express"); //Express
const path = require("path"); 


//Déclaration des routes 
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");

//Express
const app = express();

//Headers pour probleme CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

//Parser
app.use(express.json());
app.use(express.urlencoded({extended: true,}));

app.use("/images", express.static(path.join(__dirname, "images")));


//Chemin vers les routes liées à l'utilisateur
app.use("/api/user", userRoutes);

//Chemin vers les routes liées au post
app.use("/api/post", postRoutes);


module.exports = app;
