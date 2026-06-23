import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/', // 기본 주소 (localhost:5173/)
            name: 'home',
            component: () => import('../views/HomeView.vue') // 이 주소로 오면 HomeView 컴포넌트를 띄워라!
        },
        {
            path: '/movies', // (localhost:5173/movies)
            name: 'movies',
            component: () => import('../views/MoviesView.vue') // 이 주소로 오면 MoviesView 컴포넌트를 띄워라!
        },
        {
            path: '/movies/:id', // (localhost:5173/movies/12345)
            name: 'movie-detail',
            component: () => import('../views/MovieDetailView.vue') // 이 주소로 오면 MovieDetailView 컴포넌트를 띄워라!
        },
        {
            path: '/favorites', // (localhost:5173/favorites)
            name: 'favorites',
            component: () => import('../views/FavoriteMoviesView.vue') // 이 주소로 오면 FavoriteMoviesView 컴포넌트를 띄워라!
        },
        // [추가] 정해진 주소가 아닌 모든 경로를 404 페이지로 연결!
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () => import('../views/NotFoundView.vue') // 이 주소로 오면 NotFoundView 컴포넌트를 띄워라!
        }
    ]
});

export default router;