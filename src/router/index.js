import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import MoviesView from '../views/MoviesView.vue';
import MovieDetailView from '@/views/MovieDetailView.vue';
import NotFoundView from '@/views/NotFoundView.vue';

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
        },
        {
            path: '/movies/:id', // (localhost:5173/movies/12345)
            name: 'movie-detail',
            component: MovieDetailView // 이 주소로 오면 MovieDetailView 컴포넌트를 띄워라!
        },
        // [추가] 정해진 주소가 아닌 모든 경로를 404 페이지로 연결!
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: NotFoundView
        }
    ]
});

export default router;