sql = require("../initDB");

const Post = function (post) {
  this.user_id = post.user_id;
  this.title = post.title;
  this.content = post.content;
  this.image = post.image;
  this.adminApproved = post.adminApproved;
  this.reported = post.reported;
  this.created_at = post.created_at
};

//Cette fonction récupère toutes les informations qui apparaîtront sur les posts 
Post.getAll = (result) => {
    sql.query(      
        "SELECT posts.id, posts.user_id, posts.title, posts.content, posts.image, posts.adminApproved, posts.reported,posts.created_at, users.avatar, users.firstname, users.lastname, users.isAdmin FROM posts INNER JOIN users ON posts.user_id = users.userId ORDER BY posts.id DESC",
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }
            result(null, res);
        }
    );
};

//cette fonction crée un nouveau message
Post.createPost = (newPost, result) => {
  // ceci insère le nouveau message dans la table des messages
  sql.query("INSERT INTO posts SET ? ", newPost, (err, res) => {
    if (err) {
      console.log("error :", err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newPost });
  });
};

//cette fonction supprime le post
Post.delete = (postId, result) => {
    //supprimer la publication par son id
    sql.query(`DELETE FROM posts WHERE posts.id = ${postId}`, (err, res) => {
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

module.exports = Post;