<!--Template Page Home-->
<template>
  <!--Section 1 Formulaire de post-->
  <section id="section_one" class="container rounded border shadow">
    <form class="mt-3">
      <div class="form-group d-flex justify-content-around">
        <i class="fa fa-comments" style="width: 64px;font-size: 38px;color: var(--red);"></i>
        <input v-model="title" class="form-control" type="text" placeholder="Titre du post" style="width: 85%; height: 40px" />
        <i class="fa fa-comments" style="width: 64px;font-size: 38px;color: var(--red);"></i>
      </div>
      <textarea v-model="content" class="form-control" type="text" placeholder="Quoi de neuf ?" style="width: 100%; height: 80px" />
      <label for="file-input-img" style="margin-top: 10px; width: 100%">
        <span class="btn border addimage" style=" width: 100%">Ajouter une image</span>
      </label>
      <input type="file" accept="image/*" id="file-input-img" style="display:none;" />
      <button @click="createPost" class="btn btn-success" style="margin-top: 5px; margin-bottom: 10px; width: 100%">Poster votre message</button>
    </form>
  </section>

  <!--Affichage des posts-->
  <div class="container rounded border  shadow mt-5 card" v-for="post in posts" :key="post.id">
    <div class="card-header">
      <div class="row mt-2">
        <img :src="post.avatar" alt="Admin" class="rounded-circle img_profil col-md-2" style="max-width: 8%" />
        <div class="col-md-4">
          <h4>{{ post.lastname }} {{ post.firstname }}</h4>
        </div>
        <div class="col-md-5">
          <p>{{ moment(post.created_at).format("DD MMMM YYYY [a] HH:mm ") }}</p>
        </div>
        <i title="Supprimer votre message" class="fas fa-trash-alt col-md-1" style="color:red" @click="deleteMessage(post.id)"></i>
      </div>
    </div>
    <div class="card-body">
      <h5>{{ post.title }}</h5>
      <div class="row">
        <p class="col-5 mt-3">
          {{ post.content }}
        </p>
        <div class="col-md-4 offset-2">
          <a href="">
            <img class="img-fluid mt-3" :src="post.image" alt="" />
          </a>
        </div>
      </div>
    </div>
    <button @click="showcommentaire = !showcommentaire" class="btn btn-info mb-3">Afficher les commentaires</button>
    <!--Affiche les commentaire-->
    <div v-if="showcommentaire">
      <div class="container rounded border  shadow mt-5 card" v-for="comment in comments" :key="comment.id">
        <div class="card-header">
          <div class="row mt-2">
            <div class="col-md-6">
              <h4>{{ comment.lastname }}</h4>
            </div>
            <i title="Supprimer votre commentaire" class="fas fa-trash-alt col-md-1" style="color:red" @click="deleteComment(comment.post_id)"></i>

            <div class="col-md-6">
              <!--<p>{{ moment(post.created_at).format("DD MMMM YYYY [a] HH:mm ") }}</p>-->
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
      <!--Formulaire de commentaire-->
      <!-- <form class="mt-3">
      <div class="form-group d-flex justify-content-around">
        <i class="fa fa-comments" style="width: 64px;font-size: 38px;color: var(--red);"></i>
        <h2>Poster un commentaire</h2>
        <i class="fa fa-comments" style="width: 64px;font-size: 38px;color: var(--red);"></i>
      </div>
      <textarea v-model="content" class="form-control" type="text" placeholder="Votre commentaire..." style="width: 100%; height: 80px" />
      <button @click="createComment" class="btn btn-success" style="margin-top: 5px; margin-bottom: 10px; width: 100%">Commenter</button>
    </form>-->
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
      showcommentaire: false,
    };
  },
  created: function() {
    this.moment = moment;
    const self = this;
    this.$store.dispatch("getPost").then(function(response) {
      self.posts = response.data;
    });
    this.$store.dispatch("getComment").then(function(response) {
    
      self.comments = response.data;
    });
  },

  methods: {
    createPost: function(event) {
      event.preventDefault();
      const self = this;
      this.$store
        .dispatch("createPost", {
          title: this.title,
          content: this.content,
        })
        .then(
          function() {
            console.log("Post créé");
            self.$router.go();
          },
          function(error) {
            console.log(error);
          }
        );
    },

    createComment: function(event) {
      event.preventDefault();
      const self = this;
      this.$store
        .dispatch("createComment", {
          content: this.content,
        })
        .then(
          function() {
            console.log("Commentaire crée");
            self.$router.go();
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
  },
};
</script>

<style scoped>
.addimage:hover {
  background-color: rgb(206, 204, 204);
  color: white;
}
</style>
