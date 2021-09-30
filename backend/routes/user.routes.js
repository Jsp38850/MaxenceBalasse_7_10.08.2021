const express = require("express");
const router = express.Router(); //Router
const auth = require("../middlewares/auth"); // auth middleware
const multer = require("../middlewares/multer-config-avatar"); //multer

const user = require("../controllers/user.controller"); //Chemin vers le controllers

router.post("/signup", multer, user.create_an_account);//Route Post pour inscription

router.post("/login", user.connect_to_account);//Route Post pour Connexion 

router.get("/getone", auth, user.get_user_infos);//Affiche les infos utilisateur 

router.post("/changeavatar", auth, multer, user.change_avatar);

router.delete("/deleteaccount", auth, user.delete_the_account);//Route suppresion compte

module.exports = router;