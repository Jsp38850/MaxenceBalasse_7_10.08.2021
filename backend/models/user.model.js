sql = require("../initDB");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = function (user) {
  this.email = user.email;
  this.firstname = user.firstname;
  this.lastname = user.lastname;
  this.password = user.password;
  this.avatar = user.avatar;
  this.bio = user.bio;
  this.isAdmin = user.isAdmin;
};

//Création d'un nouveau compte
User.signup = (newUser, result) => {
  sql.query("INSERT INTO users SET ? ", newUser, (err, res) => {
    if (err) {
      console.log("error :", err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newUser });
  });
};

//Connection au compte
User.login = (email, password, result) => {
  // obtenir toutes les informations sur l'utilisateur qui a l'e-mail
  sql.query(`SELECT * FROM users WHERE email = ?`, email, (err, res) => {
    //si l'email existe dans la base de données
    if (res.length > 0) {
      // compare le mot de passe donné à celui de la base de données
      bcrypt.compare(password, res[0].password).then((valid) => {
        // si cela ne correspond pas, renvoie une erreur
        if (!valid) {
          console.log("error : mot de passe ", err);
          result(err, null);
          return;
        } else {
          //si cela correspond, envoyez les informations et créez un jeton d'authentification
          result(null, {            
            token: jwt.sign({ userId: res[0].userId, email: res[0].email, firstname: res[0].firstname, lastname: res[0].lastname }, "RANDOM_TOKEN_SECRET", { expiresIn: "24h" }),
          });
          console.log("Mot de passe correct");

        }
      })
      .catch((err)=>{
        console.log("erreur mot de passe", err);
        result(err, null);
      });
      
    } else {
      // si l'e-mail ne correspond pas, renvoie une erreur
      console.log("erreur adresse mail :", err);
      result(err, null);
      return;
    }
  });
};

//cette fonction récupère certaines informations d'un seul utilisateur
User.getOne = (userId, result) => {
    //retrieves infos for the user whse id is provided
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

//this is for changing the avatar
User.changeAvatar = (avatar, userId, result) => {
    //changing the avatar for the provided one for the provided user id
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



module.exports = User;
