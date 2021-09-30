import { createStore } from "vuex";

const axios = require("axios");

const instance = axios.create({
  baseURL: "http://localhost:3000/api/",
});

const store = createStore({
  state: {
    status: "",
    user: {
      userId: -1,
      token: "",
    },
  },

  mutations: {
    setStatus: function(state, status) {
      state.status = status;
    },
    logUser: function(state, user) {
      state.user = user;
    },
  },
  actions: {
    /*Connexion*/
    login: ({ commit }, userInfos) => {
      commit("setStatus", "loading");
      return new Promise((resolve, reject) => {
        instance
          .post("user/login/", userInfos)
          .then(function(response) {
            localStorage.token = response.data.token;
            commit("setStatus", "connect");
            commit("logUser", response.data);
            resolve(response);
          })
          .catch(function() {
            commit("setStatus", "error_login");
            reject("Connexion impossible");
          });
      });
    },

    /*Supprimer compte*/
    deleteData: () => {
      return new Promise((resolve, reject) => {
        instance
          .delete("user/deleteaccount", {
            headers: {
              Authorization: "Bearer " + localStorage.token,
            },
          })
          .then(function() {
            if (confirm("Etes vous sûr de vouloir supprimer votre compte ? ")) {
              localStorage.clear();
              resolve(true);
            }
          })
          .catch(function(error) {
            reject(error);
          });
      });
    },

    /*Crée un compte utilisateur*/
    createAccount: ({ commit }, userInfos) => {
      commit("setStatus", "loading");
      return new Promise((resolve, reject) => {
        commit;
        instance
          .post("user/signup/", userInfos)
          .then(function(response) {
            commit("setStatus", "created");
            resolve(response);
          })
          .catch(function(error) {
            commit("setStatus", "error_create");
            reject(error);
          });
      });
    },

    /*Création d'un post*/
    createPost: () => {
      return new Promise((resolve, reject) => {
        instance
          .post("post/", {
            headers: {
              Authorization: "Bearer " + localStorage.token,
            },
          })
          .then(function(response) {
            console.log(response);
            resolve(response);
          })
          .catch(function(error) {
            reject(error);
          });
      });
    },

    /*Affiche les info utilisateur */
    getInfo: () => {
      return new Promise((resolve, reject) => {
        instance
          .get("user/getone", {
            headers: {
              Authorization: "Bearer " + localStorage.token,
            },
          })
          .then(function(response) {
            resolve(response);
          })
          .catch(function(error) {
            reject(error);
          });
      });
    },

    /*Affiche les posts*/
    getPost: () => {
      return new Promise((resolve, reject) => {
        instance
          .get("post/")
          .then(function(response) {
            resolve(response);
          })
          .catch(function(error) {
            reject(error);
          });
      });
    },
  },
});

export default store;
