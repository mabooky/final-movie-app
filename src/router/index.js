import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import MoviesView from '../views/MoviesView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', // 기본 주소 (localhost:5173/)
      name: 'home',
      component: HomeView // 이 주소로 오면 HomeView 컴포넌트를 띄워라!
    },
    {
      path: '/movies', // (localhost:5173/movies)
      name: 'movies',
      component: MoviesView // 이 주소로 오면 MoviesView 컴포넌트를 띄워라!
    }
  ]
});

export default router;