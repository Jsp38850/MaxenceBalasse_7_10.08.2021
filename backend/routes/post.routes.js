const express = require("express");
const router = express.Router();

const post = require("../controllers/post.controller");
const auth = require("../middlewares/auth"); //authentication middleware
const multer = require("../middlewares/multer-config"); //images management middleware

router.get("/", post.list_all_posts); //Affiche tous les postes

router.get("/comments", post.retrieve_comments); //recupere les commentaire

router.post("/", auth, multer, post.post_something); //Post un nouveau message

router.delete("/deletepost", auth, post.delete_a_post); // Supprime le post

router.post("/comments/newcomment", auth, post.comment_a_post); //Comment le post

router.delete("/comments/deletecomment", auth, post.delete_a_comment); //supprime le commentaire

module.exports = router;
