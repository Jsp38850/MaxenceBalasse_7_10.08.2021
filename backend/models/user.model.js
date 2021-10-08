sql = require("../initDB");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = function (user) {
  this.email = user.email;
  this.firstname = user.firstname;
  this.lastname = user.lastname;
  this.password = user.password;
  this.avatar = user.avatar;
  this.isAdmin = user.isAdmin;
};

//Création d'un nouveau compte
User.signup = (newUser, result) => {
  sql.query("SELECT * FROM users where email = ?", newUser.email, (err, res) => {
    if (res.length > 0) {
      result("Email deja existant", null);
      return;
    } else {
      sql.query("INSERT INTO users SET ? ", newUser, (err, res) => {
        if (err) {
          console.log("error :", err);
          result(err, null);
          return;
        }
        result(null, { id: res.insertId, ...newUser });
      });
    }
  });
};
/*****************************************/

//Connection au compte
User.login = (email, password, result) => {
  // obtenir toutes les informations sur l'utilisateur qui a l'e-mail
  sql.query(`SELECT * FROM users WHERE email = ?`, email, (err, res) => {
    //si l'email existe dans la base de données
    if (res.length > 0) {
      // compare le mot de passe donné à celui de la base de données
      bcrypt
        .compare(password, res[0].password)
        .then((valid) => {
          // si cela ne correspond pas, renvoie une erreur
          if (!valid) {
            result("Password Invalid", null);
            return;
          } else {
            //si cela correspond, envoyez les informations et créez un jeton d'authentification
            result(null, {
              token: jwt.sign({ userId: res[0].userId, email: res[0].email, firstname: res[0].firstname, lastname: res[0].lastname, isAdmin: res[0].isAdmin }, "RANDOM_TOKEN_SECRET", { expiresIn: "24h" }),
            });
            console.log("Mot de passe correct");
          }
        })
        .catch((err) => {
          result(err, null);
        });
    } else {
      // si l'e-mail ne correspond pas, renvoie une erreur
      console.log("erreur adresse mail :", err);
      result(err ?? "email invalid", null);
      return;
    }
  });
};
/*****************************************/

//cette fonction récupère certaines informations d'un seul utilisateur
User.getOne = (userId, result) => {
  //récupère les informations de l'utilisateur dont l'identifiant est fourni
  sql.query(`SELECT * FROM users WHERE userId = ${userId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    } else if (res.length) {
      result(null, res[0]);
      return;
    }
  });
};
/*****************************************/

//changer l'avatar
User.changeAvatar = (avatar, userId, result) => {
  //changer l'avatar pour celui fourni pour l'identifiant utilisateur fourni
  sql.query(`UPDATE users SET avatar = '${avatar}' WHERE users.userId = ${userId}`, (err, res) => {
    if (err) {
      console.log("error :", err);
      result(err, null);
      return;
    } else {
      result(null, res[0]);
      return;
    }
  });
};
/*****************************************/

//Supprimer compte utilisateur
User.deleteAccount = (userId, result) => {
  //suppression du compte de l'utilisateur dont l'identifiant est fourni
  sql.query(`DELETE FROM users WHERE users.userId = ${userId}`, (err, res) => {
    if (err) {
      console.log("error :", err);
      result(err, null);
      return;
    } else {
      result(null, res[0]);
      return;
    }
  });
};
/*****************************************/

//Exportation du module
module.exports = User;
