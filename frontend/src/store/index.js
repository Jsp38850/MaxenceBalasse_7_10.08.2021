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
            commit("setStatus", "connect");
            commit("logUser", response.data);
            sessionStorage.token = response.data.token;
            resolve(response);
          })
          .catch(function() {
            commit("setStatus", "error_login");
            reject("Connexion impossible");
          });
      });
    },
    /*************************/

    /*Supprimer compte*/
    deleteData: () => {
      return new Promise((resolve, reject) => {
        instance
          .delete("user/deleteaccount", {
            headers: {
              Authorization: "Bearer " + sessionStorage.token,
            },
          })
          .then(function() {
            if (confirm("Etes vous sûr de vouloir supprimer votre compte ? ")) {
              sessionStorage.clear();
              resolve(true);
            }
          })
          .catch(function(error) {
            reject(error);
          });
      });
    },
    /*************************/

    /*Supprimer message*/
    deleteMessage: ({ commit }, postId) => {
      commit;
      return new Promise((resolve, reject) => {
        instance
          .delete("post/deletepost", {
            headers: {
              Authorization: "Bearer " + sessionStorage.token,
            },
            data: { post_id: postId },
          })
          .then(function() {
            if (confirm("Etes vous sûr de vouloir supprimer votre message ? ")) {
              resolve(true);
            }
          })
          .catch(function(error) {
            reject(error);
          });
      });
    },
    /*************************/

    /*Supprimer un commentaire*/
    deleteComment: ({ commit }, commentId) => {
      commit;
      return new Promise((resolve, reject) => {
        instance
          .delete("post/comments/deletecomment", {
            headers: {
              Authorization: "Bearer " + sessionStorage.token,
            },
            data: { comment_id: commentId },
          })
          .then(function() {
            if (confirm("Etes vous sûr de vouloir supprimer votre commentaire ? ")) {
              resolve(true);
            }
          })
          .catch(function(error) {
            reject(error);
          });
      });
    },
    /*************************/

    /*Approuve Message*/
    approuveMessage: ({ commit }, postId) => {
      commit;
      return new Promise((resolve, reject) => {
        instance
          .put(
            "post/approvepost",
            { post_id: postId },
            {
              headers: {
                Authorization: "Bearer " + sessionStorage.token,
              },
            }
          )
          .then(function() {
            if (confirm("Etes vous sûr de vouloir approuver votre message ? ")) {
              resolve(true);
            }
          })
          .catch(function(error) {
            reject(error);
          });
      });
    },
    /*************************/

    /*Signaler message*/
    reportMessage: ({ commit }, postId) => {
      commit;
      return new Promise((resolve, reject) => {
        instance
          .put(
            "post/reportpost",
            { post_id: postId },
            {
              headers: {
                Authorization: "Bearer " + sessionStorage.token,
              },
            }
          )
          .then(function() {
            if (confirm("Etes vous sûr de vouloir signaler ce message ? ")) {
              resolve(true);
            }
          })
          .catch(function(error) {
            reject(error);
          });
      });
    },
    /*************************/

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
    /*************************/

    /*Création d'un post*/
    createPost: ({ commit }, formData) => {
      commit;
      return new Promise((resolve, reject) => {
        instance
          .post("post/", formData, {
            headers: {
              Authorization: "Bearer " + sessionStorage.token,
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
    /*************************/

    /*Mise a jour avatar*/
    uploadImage: ({ commit }, avatar) => {
      commit;
      return new Promise((resolve, reject) => {
        instance
          .post("user/changeavatar", avatar, {
            headers: {
              Authorization: "Bearer " + sessionStorage.token,
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
    /*************************/

    /*Affiche les info utilisateur */
    getInfo: () => {
      return new Promise((resolve, reject) => {
        instance
          .get("user/getone", {
            headers: {
              Authorization: "Bearer " + sessionStorage.token,
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
    /*************************/

    /*Affiche les posts + Commentaire associé*/
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
    /*************************/

    /*Création un commentaire*/
    createComment: ({ commit }, post) => {
      commit;
      return new Promise((resolve, reject) => {
        instance
          .post(
            "post/comments/newcomment",
            { post_id: post.id, content: post.comment },
            {
              headers: {
                Authorization: "Bearer " + sessionStorage.token,
              },
            }
          )
          .then(function(response) {
            resolve(response);
          })
          .catch(function(error) {
            reject(error);
          });
      });
    },
    /*************************/
  },
});

export default store;
