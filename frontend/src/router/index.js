import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import NotFound from "@/views/NotFound.vue";
import Profil from "@/views/Profil.vue";

const routes = [
  {
    /*Page Connexion & Inscription*/
    name: "Login",
    path: "/",
    component: Login,
    meta: {
      title: "Connexion | Groupomania",
      layout: "DefaultHeader",
    },
  },
  {
    /*Page Principal (Post)*/
    name: "Home",
    path: "/Home",
    component: Home,
    meta: {
      title: "Accueil | Groupomania",
      plainLayout: true,
    },
  },
  {
    /*Page Profil*/
    name: "Profil",
    path: "/Profil",
    component: Profil,
    meta: {
      title: "Profil | Groupomania",
      plainLayout: true,
    },
  },
  {
    /*Page 404 (erreur de lien)*/
    name: "NotFound",
    path: "/:pathMatch(.*)",
    component: NotFound,
    meta: {
      title: "404 NotFound | Groupomania",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.afterEach((to) => {
  document.title = to.meta.title;
});

export default router;
