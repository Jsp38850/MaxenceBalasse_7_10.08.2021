<!--Template Page Home-->
<template>
  <!--Section 1 Formulaire de post-->
  <section id="section_one" class="container rounded border shadow">
    <form class="mt-3">
      <h1>Poster un message</h1>
      <div class="form-group d-flex justify-content-around">
        <i class="fa fa-comments" style="width: 64px;font-size: 38px;color: var(--red);"></i>
        <label for="titre" :hidden="true">Titre du formulaire</label>
        <input v-model="title" class="form-control" id="titre" name="titre du message" type="text" placeholder="Titre du post" style="width: 85%; height: 40px" />
        <i class="fa fa-comments" style="width: 64px;font-size: 38px;color: var(--red);"></i>
      </div>
      <label for="content" :hidden="true">Contenu du formulaire</label>
      <textarea v-model="content" class="form-control" id="content" type="text" placeholder="Quoi de neuf ?" style="width: 100%; height: 80px" />
      <input type="file" ref="file" accept="image/*" @change="addImage()" id="file-input-img" style="display:none;" />
      <label for="file-input-img" style="margin-top: 10px; width: 100%">
        <span class="btn border addimage" style=" width: 100%">Ajouter une image</span>
      </label>
      <button @click="createPost" class="btn btn-success" style="margin-top: 5px; margin-bottom: 10px; width: 100%; color:black">Poster votre message</button>
    </form>
  </section>

  <!--Affichage des posts-->
  <div class="container rounded border  shadow mt-5 card" v-for="post in posts" :key="post.id">
    <div class="card-header">
      <div class="row mt-2">
        <img :src="post.avatar" alt="" class="rounded-circle img_profil col-md-2" style="max-width: 8%" />
        <div class="col-md-4">
          <h3>{{ post.lastname }} {{ post.firstname }}</h3>
        </div>
        <div class="col-md-6">
          <p>{{ moment(post.created_at).format("DD MMMM YYYY [a] HH:mm ") }}</p>
        </div>
        <div class="col-md-1">
          <i title="Supprimer votre message" class="fas fa-trash-alt mr-2 " style="color:red" @click="deleteMessage(post.id)"></i>
          <i title="Signaler ce post" class="fas fa-comment-slash " style="color:blue" @click="reportMessage(post.id)"></i>
        </div>
      </div>
    </div>
    <div class="card-body">
      <h4>{{ post.title }}</h4>
      <div class="row">
        <p class="col-5 mt-3">
          {{ post.content }}
        </p>
        <div class="col-md-4 offset-2" :hidden="post.image == null">
          <img class="img-fluid mt-3" :src="post.image" alt="image post" />
        </div>
      </div>
    </div>
    <button @click="showComments(post.id)" class="btn btn_info  mb-3 ">Afficher les commentaires</button>
    <!--Affiche les commentaire-->
    <div>
      <!--Formulaire de commentaire-->
      <form class="mt-3">
        <div class="form-group d-flex justify-content-around">
          <i class="fa fa-comments" style="width: 64px;font-size: 38px;color: var(--red);"></i>
          <h2>Poster un commentaire</h2>
          <i class="fa fa-comments" style="width: 64px;font-size: 38px;color: var(--red);"></i>
        </div>
        <textarea v-model="content" aria-labelledby="comment" class="form-control" type="text" id="comment" placeholder="Votre commentaire..." style="width: 100%; height: 80px" />
        <button @click="createComment" class="btn btn-success" style="margin-top: 5px; margin-bottom: 10px; width: 100%">Commenter</button>
      </form>
      <div class="container rounded border shadow mt-5 card" v-for="comment in comments" :key="comment.id">
        <div class="card-header">
          <div class="row mt-2 ">
            <img :src="post.avatar" alt="" class="rounded-circle img_profil col-md-2" style="max-width: 8%" />
            <div class="col-md-4">
              <h4>{{ comment.lastname }} {{ comment.firstname }}</h4>
            </div>
            <div class="col-md-5">
              <p>{{ moment(post.created_at).format("DD MMMM YYYY [a] HH:mm ") }}</p>
            </div>
            <div class="col-md-1">
              <i title="Supprimer votre message" class="fas fa-trash-alt mr-2 " style="color:red" @click="deleteMessage(comment.post.id)"></i>
              <i title="Signaler ce post" class="fas fa-comment-slash " style="color:blue" @click="reportMessage(comment.post.id)"></i>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="row">
            <p class="col-12 mt-3">
              {{ comment.content }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import "moment/locale/fr";

export default {
  name: "Home",

  data: function() {
    return {
      posts: [],
      comments: [],
      title: "",
      content: "",
      file: null,
    };
  },
  created: function() {
    this.moment = moment;
    const self = this;
    this.$store.dispatch("getPost").then(function(response) {
      self.posts = response.data;
    });
  },

  methods: {
    addImage() {
      this.file = this.$refs.file.files[0];
    },
    createPost: function() {
      let formData = new FormData();
      formData.append("image", this.file);
      formData.append("title", this.title);
      formData.append("content", this.content);
      const self = this;
      this.$store.dispatch("createPost", formData).then(
        function() {
          console.log("Post créé");
          self.$router.go();
        },
        function(error) {
          console.log(error);
        }
      );
    },

    showComments: function(postId) {
      const self = this;
      this.$store.dispatch("showComments", postId).then((comments) => {
        console.log(comments.data);
        self.comments = comments.data;
      });
    },

    createComment: function(postId) {
      this.$store
        .dispatch("createComment", {
          content: this.content,
          postId,
        })
        .then(
          function() {
            console.log("Commentaire crée");
          },
          function(error) {
            console.log(error);
          }
        );
    },

    deleteMessage: function(postId) {
      const self = this;
      this.$store.dispatch("deleteMessage", postId).then(
        function() {
          console.log("Message supprimer");
          self.$router.go();
        },
        function(error) {
          console.log(error);
        }
      );
    },

    deleteComment: function(commentId) {
      const self = this;
      this.$store.dispatch("deleteComment", commentId).then(
        function() {
          console.log("Comentaire supprimer");
          self.$router.go();
        },
        function(error) {
          console.log(error);
        }
      );
    },

    reportMessage: function(postId) {
      const self = this;
      this.$store.dispatch("reportMessage", postId).then(
        function() {
          console.log("Message signaler");
          self.$router.go();
        },
        function(error) {
          console.log(error);
        }
      );
    },
  },
};
</script>

<style scoped>
.addimage:hover {
  background-color: rgb(206, 204, 204);
  color: white;
}
.btn {
  color: black;
}

.btn_info {
  background-color: #57d7ea;
}
</style>
