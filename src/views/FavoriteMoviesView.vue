<script setup>
import { useMovieStore } from '@/stores/movie';
import MovieCardList from '@/components/MovieCardList.vue';
import { computed } from 'vue';
import { onActivated } from 'vue';

defineOptions({ name: 'FavoriteMoviesView' });

const store = useMovieStore();

onActivated(() => {
    document.title = '찜한 영화 목록 - NETVUE';
});

const listState = computed(() => {
    if (store.favoriteMovies.length === 0) {
        return { state: 'empty', message: '아직 찜한 영화가 없습니다. 영화 목록에서 마음에 드는 작품을 찜해보세요!' };
    }
    return { state: 'loaded', movies: store.favoriteMovies, favoriteMovies: store.favoriteMovies };
});

function onToggleFavorite(movieId) {
    const movie = store.favoriteMovies.find(m => m.id === movieId);
    if (movie) {
        store.toggleFavorite(movie);
    }
}
</script>

<template>
    <main class="page">
        <div class="header-section">
            <h1>💖 내가 찜한 영화 💖</h1>
            <p class="sub-title">총 {{ store.favoriteMovies.length }}개의 작품을 찜하셨습니다</p>
        </div>

        <MovieCardList
            :state="listState"
            @toggle-favorite="onToggleFavorite"
        />
    </main>
</template>

<style scoped>
.page {
    padding: 40px;
    background-color: #f8f9fa;
    min-height: 100vh;
}

.header-section {
    margin-bottom: 36px;
    text-align: center;
    color: #2c3e50;
}

.sub-title {
    font-size: 14px;
    color: #7f8c8d;
    margin-top: 6px;
}
</style>