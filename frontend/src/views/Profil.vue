<template>
  <div class="container">
    <div class="main-body">
      <div class="row gutters-sm">
        <div class="col-md-4 mb-3">
          <div class="card">
            <input type="file" accept="image/*" @change="uploadImage($event)" id="file-input" style="display:none;" />
            <label for="file-input">
              <i class="far fa-images d-flex ml-2 mt-2 iconeProfil" id="file-imput" title="Importer votre avatar"></i>
            </label>
            <div class="card-body">
              <div class="d-flex flex-column align-items-center text-center">
                <img :src="image" alt="Avatar" class="rounded-circle img_profil" width="150" />
                <div class="mt-3">
                  <h4>{{ lastname }} {{ firstname }}</h4>
                  <span v-if="isAdmin == 1" class="labelAdmin">Administrateur</span>
                  <span v-else class="labelMembre">Membre</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-8">
          <div class="card mb-3">
            <div class="card-body">
              <div class="row">
                <div class="col-sm-3">
                  <h6 class="mb-0">Nom / Prenom</h6>
                </div>
                <div class="col-sm-8 text-secondary">{{ lastname }} {{ firstname }}</div>
              </div>
              <hr />
              <div class="row">
                <div class="col-sm-3">
                  <h6 class="mb-0">Adresse Mail</h6>
                </div>
                <div class="col-sm-9 text-secondary">
                  {{ email }}
                </div>
              </div>
              <hr />
              <div class="col-sm-12">
                <button class="btn btn-danger col-12 " @click="deleteData">Supprimer mon compte</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <section v-if="isAdmin == 1">
    <!--Titre Post Signaler-->
    <div>
      <i class="fas fa-exclamation-triangle" style="color:red"></i>
      <h1>Poste Signaler</h1>
      <i class="fas fa-exclamation-triangle" style="color:red"></i>
    </div>
    <!--Affichage des posts-->
    <div class="container rounded border  shadow mt-5 card" v-for="post in posts" :key="post.id">
      <div v-if="post.reported == 1">
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
              <i title="Approuver le message" class="fas fa-check" style="color:green" @click="appouveMessage(post.id)"></i>
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
      </div>
    </div>
  </section>
</template>

<script>
import moment from "moment";
import "moment/locale/fr";

export default {
  data: function() {
    return {
      email: "",
      lastname: "",
      firstname: "",
      image: "",
      posts: [],
      title: "",
      content: "",
      file: null,
      seen: false,
    };
  },

  methods: {
    deleteData: function(event) {
      event.preventDefault();
      const self = this;
      this.$store.dispatch("deleteData").then(
        function() {
          self.$router.push("/");
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

    appouveMessage: function(postId) {
      const self = this;
      this.$store.dispatch("approuveMessage", postId).then(
        function() {
          console.log("Message Approuve");
          self.$router.go();
        },
        function(error) {
          console.log(error);
        }
      );
    },

    /*Mise a jour avatar*/
    uploadImage: function(event) {
      let data = new FormData();

      data.append("avatar", event.target.files[0]);
      const self = this;
      this.$store.dispatch("uploadImage", data).then(
        function() {
          console.log("Avatar modifier");
          self.$router.go();
        },
        function(error) {
          console.log(error);
        }
      );
    },
  },

  created: function() {
    const self = this;
    this.$store.dispatch("getInfo").then(function(response) {
      (self.email = response.data.email), (self.lastname = response.data.lastname), (self.firstname = response.data.firstname), (self.image = response.data.avatar), (self.isAdmin = response.data.isAdmin);
    });
    this.moment = moment;
    this.$store.dispatch("getPost").then(function(response) {
      self.posts = response.data;
    });
  },
};
</script>

<style scoped>
.card {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 0 solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
}

.card-body {
  flex: 1 1 auto;
  min-height: 1px;
  padding: 1rem;
}

.gutters-sm {
  margin-right: -8px;
  margin-left: -8px;
}

.gutters-sm > .col,
.gutters-sm > [class*="col-"] {
  padding-right: 8px;
  padding-left: 8px;
}
.mb-3,
.my-3 {
  margin-bottom: 1rem !important;
}

.iconeProfil {
  font-size: 25px;
  cursor: pointer;
  color: grey;
  opacity: 50%;
}

.iconeProfil:hover {
  opacity: 100%;
}

.labelAdmin {
  background-color: blue;
  color: white;
  padding: 5px;
}

.labelMembre {
  background-color: rgb(3, 121, 19);
  color: white;
  padding: 5px;
}
</style>
