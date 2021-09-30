sql = require("../initDB");

// constructor
const Comment = function (comment) {
  this.id = comment.id;
  this.user_id = comment.user_id;
  this.post_id = comment.post_id;
  this.content = comment.content;
};

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

//modèle pour supprimer un commentaire
Comment.delete = (commentId, result) => {
    //cela supprime le commentaire identifié par son id
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

module.exports = Comment;
