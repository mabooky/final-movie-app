<script setup>
import { useMovieStore } from '@/stores/movie';
import { Failure, Success } from '@/utils/Result';
import MovieCardList from '@/components/MovieCardList.vue';
import Pagination from '@/components/Pagination.vue';
import { computed, onActivated, onMounted, ref } from 'vue';

defineOptions({ name: 'MoviesView' });

const store = useMovieStore();
const fetchResult = ref(null);
const currentPage = ref(1);
const totalPages = computed(() => {
    return fetchResult.value instanceof Success ? Math.ceil(store.movies.length / 10) : 1;
});

onMounted(async () => {
    fetchResult.value = await store.fetchMovies();
});

onActivated(() => {
    document.title = '실시간 인기 상영작 - NETVUE';
})

async function onPageChange(page) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

const sortBy = ref('default');

const sortedMovies = computed(() => {
    const list = [...store.movies];
    switch (sortBy.value) {
        case 'title':
            return list.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
        case 'release_date':
            return list.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
        case 'rating':
            return list.sort((a, b) => b.vote_average - a.vote_average);
        default:
            return list;
    }
});

const listState = computed(() => {
    if (!fetchResult.value) {
        return { state: 'loading' };
    }
    else if (fetchResult.value instanceof Failure) {
        return { state: 'error', message: fetchResult.value.errorMessage };
    }
    else if (fetchResult.value instanceof Success) {
        return { 
            state: 'loaded',
            movies: sortedMovies.value.slice((currentPage.value - 1) * 10, currentPage.value * 10),
            favoriteMovies: store.favoriteMovies
        };
    }
});

function onToggleFavorite(movieId) {
    const movie = store.movies.find(m => m.id === movieId);
    if (movie) {
        store.toggleFavorite(movie);
    }
}
</script>

<template>
    <main class="page">
        <div class="header-section">
            <h1>🍿 실시간 인기 상영작 🍿</h1>
        </div>

        <!-- 정렬 탭 -->
        <div class="sort-section">
            <button
                class="sort-tab"
                :class="{ 'sort-tab--active': sortBy === 'default' }"
                @click="sortBy = 'default'"
            >
                📋 기본순
            </button>
            <button
                class="sort-tab"
                :class="{ 'sort-tab--active': sortBy === 'title' }"
                @click="sortBy = 'title'"
            >
                🔤 제목순
            </button>
            <button
                class="sort-tab"
                :class="{ 'sort-tab--active': sortBy === 'release_date' }"
                @click="sortBy = 'release_date'"
            >
                📅 개봉일순
            </button>
            <button
                class="sort-tab"
                :class="{ 'sort-tab--active': sortBy === 'rating' }"
                @click="sortBy = 'rating'"
            >
                ⭐ 평점순
            </button>
        </div>

        <MovieCardList
            :state="listState"
            @toggle-favorite="onToggleFavorite"
        />

        <Pagination
            v-if="listState.state === 'loaded'"
            :current-page="currentPage"
            :total-pages="totalPages"
            @page-change="onPageChange"
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
    margin-bottom: 30px;
    text-align: center;
    color: #2c3e50;
}

/* ── 정렬 탭 ── */
.sort-section {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 36px;
    flex-wrap: wrap;
}

.sort-tab {
    padding: 9px 18px;
    border: 2px solid #e0e4e8;
    border-radius: 50px;
    background: #ffffff;
    color: #5a6270;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    user-select: none;
    white-space: nowrap;
}

.sort-tab:hover {
    border-color: #b0b8c4;
    color: #2c3e50;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.sort-tab--active {
    background: linear-gradient(135deg, #ff4757, #ff6b81);
    border-color: transparent;
    color: #ffffff;
    box-shadow: 0 4px 16px rgba(255, 71, 87, 0.35);
    transform: translateY(-2px);
}

/* ── 결과 정보 ── */
.result-info {
    text-align: center;
    font-size: 13px;
    color: #7f8c8d;
    margin: 0 0 24px 0;
}

.result-info strong {
    color: #2c3e50;
    font-weight: 700;
}
</style>