const Post = require("../models/post.model.js");
const Comment = require("../models/comment.model");
const jwt = require("jsonwebtoken");
const util = require("util");

//Supprime un message
exports.delete_a_post = (req, res) => {
  const postId = req.body.post_id;
  Post.delete(postId, (err, data) => {
    if (err) {
      res.status(500).send({
        message: "Erreur lors de la suppression du message avec l'identifiant :" + postId,
      });
    } else res.send(data);
  });
};
/*********************************/

//Commenter un post
exports.comment_a_post = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  const userId = decodedToken.userId;
  //Définis un nouveau commentaire avec le corps envoyé par le frontend
  const comment = new Comment({
    post_id: req.body.post_id,
    user_id: userId,
    content: req.body.content,
  });
  Comment.createComment(comment, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Une erreur s'est produite lors de la création d'un nouveau commentaire",
      });
    else res.send(data);
  });
};
/*********************************/

//Récupère tous les messages
exports.list_all_posts = async (req, res) => {
  Post.getAll(async (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Une erreur s'est produite lors de la récupération des messages",
      });
    else {
      await Promise.all(
        data.map(async (post) => {
          let getComment = util.promisify(Comment.get);
          await getComment(post.id).then((data) => {
            post.comments = data;
          });
          return post;
        })
      );
      res.send(data);
    }
  });
};
/*********************************/

//Obtenir les commentaires sous un post
exports.retrieve_comments = (req, res) => {
  const postId = req.query.post_id;
  Comment.get(postId, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Une erreur s'est produite lors de la récupération des commentaires",
      });
    else res.send(data);
  });
};
/*********************************/

//Supprime un commentaire
exports.delete_a_comment = (req, res) => {
  const commentId = req.body.comment_id;
  Comment.delete(commentId, (err, data) => {
    if (err) {
      res.status(500).send({
        message: "Une erreur s'est produite lors de la suppresion du commentaire",
      });
    } else res.send(data);
  });
};
/*********************************/

//Création d'un nouveau message
exports.post_something = (req, res) => {
  //Vérifier s'il y a du contenu
  if (!req.body) {
    res.status(400).send({
      message: "Vous devez ajouter du contenu à votre message !",
    });
  }
  //Récupération de l'identifiant de l'utilisateur connecté
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  const userId = decodedToken.userId;
  //si aucune image n'est envoyée
  if (!req.file) {
    //créer un nouveau message que l'utilisateur a envoyée
    const post = new Post({
      user_id: userId,
      title: req.body.title,
      content: req.body.content,
      image: null,
      adminApproved: 0,
      reported: 0,
      created_at: new Date(),
    });
    //enregistrer le message dans la base de données
    Post.createPost(post, (err, data) => {
      if (err)
        res.status(500).send({
          message: err.message || "Une erreur s'est produite lors de la création du post !",
        });
      else res.send(data);
    });
  } else if (req.file) {
    // s'il y a une image avec la publication, créez une nouvelle publication
    const post = new Post({
      user_id: userId,
      title: req.body.title,
      content: req.body.content,
      image: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      adminApproved: 0,
      reported: 0,
      created_at: new Date(),
    });
    //enregistrer le message dans la base de données
    Post.createPost(post, (err, data) => {
      if (err)
        res.status(500).send({
          message: err.message || "Une erreur s'est produite lors de la création du post !",
        });
      else res.send(data);
    });
  }
};
/*********************************/

//Signaler un post
exports.report_a_post = (req, res) => {
  const postId = req.body.post_id;
  Post.report(postId, (err, data) => {
    if (err) {
      res.status(500).send({
        message: "Erreur report publication avec l'identifiant :" + postId,
      });
    } else res.send(data);
  });
};
/*********************************/

//Approuver un post (Reserver a isAdmin = 1)
exports.approve_a_post = (req, res) => {
  const postId = req.body.post_id;
  Post.approve(postId, (err, data) => {
    if (err) {
      res.status(500).send({
        message: "Erreur avec l'identifiant:" + postId,
      });
    } else res.send(data);
  });
};
/*********************************/