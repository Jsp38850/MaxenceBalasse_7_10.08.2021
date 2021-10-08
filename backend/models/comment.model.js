sql = require("../initDB");

//constructor
const Comment = function (comment) {
  this.id = comment.id;
  this.user_id = comment.user_id;
  this.post_id = comment.post_id;
  this.content = comment.content;
};

//modèle pour recupere les commentaires
Comment.get = (postId, result) => {
  sql.query(
    //cette requête sélectionne les informations pertinentes dans les tableaux des commentaires et des utilisateurs, et les joint au user_id
    `SELECT comments.id, comments.user_id, comments.post_id, comments.content, users.firstname, users.lastname, users.avatar, users.isAdmin FROM comments INNER JOIN users ON comments.user_id = users.userId WHERE comments.post_id = ${postId} ORDER BY comments.id DESC`,
    (err, res) => {
      if (err) {
        console.log("error : ", err);
        result(null, err);
        return;
      }
      result(null, res);
    }
  );
};
/*****************************************/

//modèle pour poster un commentaire
Comment.createComment = (newComment, result) => {
  //cette requête définit le nouveau commentaire
  sql.query("INSERT INTO comments SET ?", newComment, (err, res) => {
    if (err) {
      console.log("error :", err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newComment });
  });
};
/*****************************************/

//modèle pour supprimer un commentaire
Comment.delete = (commentId, result) => {
  //this deletes the comment that is identified by its id
  sql.query(`DELETE FROM comments WHERE comments.id = ${commentId}`, (err, res) => {
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
module.exports = Comment;
