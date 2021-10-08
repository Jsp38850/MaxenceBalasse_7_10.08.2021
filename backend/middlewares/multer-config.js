const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
};

//middleware multer pour les images de messages
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  //Définir le nom de fichier pour s'assurer qu'il n'y a pas de double
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_"); //Remplacement des espaces par des traits  dans le nom
    const extension = MIME_TYPES[file.mimetype]; //Déclarer l'extension
    callback(null, name + Date.now() + "." + extension); //Création d'un nom de fichier complet avec nom + date + extension
  },
});

module.exports = multer({ storage }).single("image");
