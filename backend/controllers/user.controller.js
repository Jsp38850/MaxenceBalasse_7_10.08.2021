//Importation du model user
const User = require("../models/user.model.js");
sql = require("../initDB");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passwordValidator = require("password-validator");

/***Schema password validation***/
var schema = new passwordValidator();

schema
  .is()
  .min(6) //min 6 characters
  .is()
  .max(20) //max 20 characters
  .has()
  .uppercase() //au moins une lettre majuscule
  .has()
  .lowercase() //au moins une lettre minuscule
  .has()
  .digits(1); //au moins un chiffre

//Function Création d'un compte
exports.create_an_account = function (req, res) {
  if (!req.body) {
    res.status(400).send({
      message: "Vous devez remplir le formulaire !",
    });
  } else if (!schema.validate(req.body.password)) {
    res.status(422).send({
      message: "Le mot de passe doit faire entre 6 et 20 caractères et contenir 1 majuscule, 1 minuscule et 1 chiffre minimum",
    });
  } else {
    //hash du mot de passe
    bcrypt.hash(req.body.password, 10).then((hash) => {
      //créer un nouvel utilisateur avec les entrées frontend
      if (!req.file) {
        const user = new User({
          avatar: `${req.protocol}://${req.get("host")}/images/avatar_default.png`, //si l'utilisateur n'a pas sélectionné d'avatar, chemin vers l'avatar par défaut
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          password: hash,
          isAdmin: 0,
        });

        //enregistrer dans la base de données
        User.signup(user, (err, data) => {
          if (err)
            res.status(500).send({
              message: err.message || "Une erreur s'est produite lors de la création de l'utilisateur !",
            });
          else res.send(data);
        });
      } else if (req.file) {
        const user = new User({
          avatar: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          password: hash,
          isAdmin: 0,
        });

        //enregistrer dans la base de données
        User.signup(user, (err, data) => {
          if (err)
            res.status(500).send({
              message: err.message || "Une erreur s'est produite lors de la création de l'utilisateur !",
            });
          else res.send(data);
        });
      }
    });
  }
};
/************************/

//function connection au compte
exports.connect_to_account = function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  //si l'email et le mot de passe sont renseignés
  if (email && password) {
    User.login(email, password, (err, data) => {
      console.log(err);
      console.log(data);
      if (err)
        res.status(500).send({
          message: err.message || "Une erreur s'est produite lors de la connexion au compte !",
        });
      else res.send(data);
    });
  } else {
    //si le formulaire n'est pas rempli, renvoie une erreur
    res.status(500).json({ message: "Vous devez remplir le formulaire de connexion" });
  }
};
/************************/

//Obtenir des informations sur un seul utilisateur
exports.get_user_infos = function (req, res) {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  const userId = decodedToken.userId;

  User.getOne(userId, (err, data) => {
    if (err) {
      res.status(500).send({
        message: "Erreur lors de la récupération de l'utilisateur avec cet identifiant : " + userId,
      });
    } else res.send(data);
  });
};
/************************/

//Changer votre avatar
exports.change_avatar = function (req, res) {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  const userId = decodedToken.userId;
  const avatar = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

  User.changeAvatar(avatar, userId, (err, data) => {
    if (err) {
      res.status(500).send({
        message: "Erreur lors du changement d'avatar !",
      });
    } else res.send(data);
  });
};
/************************/

//Supprimer mon compte
exports.delete_the_account = function (req, res) {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  const userId = decodedToken.userId;

  User.deleteAccount(userId, (err, data) => {
    if (err) {
      res.status(500).send({
        message: "Erreur lors de la suppression de l'utilisateur avec l'identifiant :" + userId,
      });
    } else res.send(data);
  });
};
/************************/
