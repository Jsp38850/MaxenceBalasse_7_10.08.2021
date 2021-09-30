<template>
  <div class="container">
    <div class="main-body">
      <div class="row gutters-sm">
        <div class="col-md-4 mb-3">
          <div class="card">
            <input type="file" accept="image/*" @change="uploadImage($event)" id="file-input" />
            <i class="far fa-images d-flex ml-2 mt-2 iconeProfil" @click="imgProfil"></i>
            <div class="card-body">
              <div class="d-flex flex-column align-items-center text-center">
                <img :src="image" alt="Admin" class="rounded-circle img_profil" width="150" />
                <div class="mt-3">
                  <h4>{{ lastname }} {{ firstname }}</h4>
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
</template>

<script>
export default {
  data: function() {
    return {
      email: "",
      lastname: "",
      firstname: "",
      image: "",
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

    uploadImage: function(event) {
      let data = new FormData();
      data.append("name", event.target.files[0].name);
      data.append("file", event.target.files[0]);
      const self = this;
      this.$store
        .dispatch("uploadImage", {
          avatar: event.target.files[0],
        })
        .then(
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
      console.log(response);
      (self.email = response.data.email), (self.lastname = response.data.lastname), (self.firstname = response.data.firstname), (self.image = response.data.avatar);
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
</style>
