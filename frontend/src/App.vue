<template>
  <header class="container d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
    <a href="" class="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
      <img class="bi me-2" src="./assets/logo.png" alt="" width="300" height="82" role="img" aria-label="Bootstrap" />
    </a>
    <div v-if="$route.meta.plainLayout">
      <i title="Acceder à votre profil" class="fas fa-user-circle icone " @click="profil" style=" color:green;  "></i>
      <i title="Deconnexion" class="fas fa-sign-out-alt icone" style="color: red;" @click="Deconnexion"></i>
      <i title="Retour au post" class="fas fa-home icone" @click="Home"></i>
    </div>
  </header>

  <router-view />

  <footer>
    <p class="copyright mt-5">Groupomania © 2021</p>
  </footer>
</template>

<script>
export default {
  name: "App",

  methods: {
    profil: function() {
      this.$router.push("profil");
    },
    Home: function() {
      this.$router.push("Home");
    },
    Deconnexion: function() {
      localStorage.clear();
      this.$router.push("/");
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.icone {
  width: 55px;
  font-size: 30px;
  cursor: pointer;
}
</style>
