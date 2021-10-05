<!--Template Page Connexion / Inscription-->
<template>
  <section id="section_one" class="container rounded">
    <div class="row">
      <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <div class="card border-0 shadows rounded-3 my-5">
          <div class="card-body p-4 p-sm-5">
            <h1 class="card-title text-center mb-5 fw-light fs-5" v-if="mode == 'Inscription'">Inscription</h1>
            <h1 class="card-title text-center mb-5 fw-light fs-5" v-else>Connexion</h1>

            <p v-if="mode == 'Inscription'">Tu as deja un compte ? <span class="card_action" @click="switchToLogin">Connexion</span></p>
            <p v-else>Tu n'as pas encore de compte ? <span class="card_action" @click="switchToCreateAccount">Crée un compte</span></p>

            <form>
              <div class="form-floating mb-3">
                <label for="floatingEmail" :hidden="true">Champ Email</label>
                <input v-model="email" type="text" class="form-control" id="floatingEmail" placeholder="Entrez Votre Adresse Email" />
              </div>
              <div class="d-flex justiy-content-between mb-3" v-if="mode == 'Inscription'">
                <div class="form-floating">
                  <label for="floatingName" :hidden="true">Champ lastname</label>
                  <input v-model="lastname" type="text" class="form-control" id="floatingName" placeholder="Votre Nom ..." />
                </div>
                <div class="form-floating ml-2">
                  <label for="floatingPrenom" :hidden="true">Champ firstname</label>
                  <input v-model="firstname" type="text" class="form-control" id="floatingPrenom" placeholder="Votre Prenom ..." />
                </div>
              </div>
              <div class="form-floating mb-3">
                <label for="floatingPassword" :hidden="true">Champ Password</label>
                <input v-model="password" type="password" class="form-control" id="floatingPassword" placeholder="Entrez Votre Mot de passe" />
              </div>
              <div class="form-row" v-if="mode == 'Login' && status == 'error_login'">
                Adresse mail et/ou mot de passe invalide
              </div>
              <div class="form-row" v-if="mode == 'Inscription' && status == 'error_create'">
                Adresse mail déjà utilisée
              </div>
              <div class="d-grid">
                <button @click="createAccount" class="btn btn-primary btn-login text-uppercase fw-bold" :disabled="!validatedFields" :class="{ 'button--disabled': !validatedFields }" v-if="mode == 'Inscription'">
                  <span v-if="status == 'created'" id="loading"></span>
                  <span v-else>M'inscrire</span>
                </button>
                <button @click="login" class="btn btn-primary btn-login text-uppercase fw-bold" :disabled="!validatedFields" :class="{ 'button--disabled': !validatedFields }" v-else>
                  <span v-if="status == 'connect'" id="loading"></span>
                  <span v-else>Connexion</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Login",

  data: function() {
    return {
      mode: "Inscription",
      email: "",
      lastname: "",
      firstname: "",
      password: "",
    };
  },
  computed: {
    validatedFields: function() {
      if (this.mode == "Inscription") {
        if (this.email != "" && this.lastname != "" && this.firstname != "" && this.password != "") {
          return true;
        } else {
          return false;
        }
      } else {
        if (this.email != "" && this.password != "") {
          return true;
        } else {
          return false;
        }
      }
    },
    ...mapState(["status"]),
  },
  methods: {
    switchToLogin: function() {
      this.mode = "Login";
    },

    switchToCreateAccount: function() {
      this.mode = "Inscription";
    },
    login: function(event) {
      if (event) {
        event.preventDefault();
      }
      const self = this;
      this.$store
        .dispatch("login", {
          email: this.email,
          password: this.password,
        })
        .then(function() {
          self.$router.push("/Home");
        })
        .catch(function() {
          console.log("Erreur connexion");
        });
    },
    createAccount: function(e) {
      e.preventDefault();
      const self = this;
      this.$store
        .dispatch("createAccount", {
          email: this.email,
          lastname: this.lastname,
          firstname: this.firstname,
          password: this.password,
        })
        .then(
          function() {
            console.log("Compte créé");
            self.login();
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
#section_one {
  background-image: url("../assets/background_groupomania.jpg");
}

.btn-login {
  font-size: 0.9rem;
  letter-spacing: 0.05rem;
  padding: 0.75rem 1rem;
}
.card_action {
  color: blue;
}

.card_action:hover {
  color: purple;
  cursor: pointer;
}

.button--disabled {
  background: #cecece;
  color: #ececec;
  border: none;
}
.button--disabled:hover {
  cursor: not-allowed;
  background: #cecece;
}

#loading {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  -webkit-animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
@-webkit-keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}

</style>
