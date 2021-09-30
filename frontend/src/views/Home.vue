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
      <!-- <input type="file" id="avatar" class="mt-2 mb-2 " name="avatar" accept="image/png, image/jpeg" />-->
      <button @click="createPost" class="btn btn-success" style="margin: 5px; width: 100%">Poster votre message</button>
    </form>
  </section>

  <!--Affichage des posts-->
  <div class="container rounded border  shadow mt-5 card" v-for="post in posts" :key="post.id">
    <div class="card-header">
      <div class="row mt-2">
        <div class="col-md-6">
          <h4>{{ post.lastname }} {{ post.firstname }}</h4>
        </div>
        <div class="col-md-6">
          <p>{{ moment(post.created_at).format("DD MMMM YYYY [a] HH:mm ") }}</p>
        </div>
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
    <button type="button" class="btn btn-info mb-3">Commentaire</button>
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
      title: "",
      content: "",
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
    createPost: function() {
      this.$store
        .dispatch("createPost", {
          title: this.title,
          content: this.content,
        })
        .then(
          function() {
            console.log("Post créé");
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

</style>
