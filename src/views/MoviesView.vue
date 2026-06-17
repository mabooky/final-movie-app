<script setup>
import { useMovieStore } from '@/stores/movie';
import { Failure } from '@/utils/Result';
import { onMounted, ref } from 'vue';

// 중앙 금고 호출
const store = useMovieStore();

const fetchResult = ref(null);

// onMounted는 이 화면이 브라우저에 장착(Mount)되는 순간을 감지하여 내부 코드를 즉시 실행합니다.
onMounted(async () => {
    document.title = '실시간 인기 상영작 - NETVUE';

    fetchResult.value = await store.fetchMovies();
});
</script>

<template>
    <main class="page">
        <div class="header-section">
            <h1>🍿 실시간 인기 상영작 🍿</h1>
        </div>

        <div v-if="!fetchResult" class="status-message loading">
            ⏳ 실시간 국내 개봉작 데이터를 싣고 오는 중입니다...
        </div>

        <div v-else-if="fetchResult && fetchResult instanceof Failure" class="status-message error">
            🚨 오류가 발생했습니다.<br><br>상세 오류 메시지: {{ fetchResult.errorMessage }}
        </div>

        <div v-else class="movie-list">
            <div v-for="movie in store.movies" :key="movie.id" class="movie-card">
                <img v-if="movie.poster_path" :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
                    :alt="movie.title" class="poster" />
                <div v-else class="poster-placeholder">이미지 준비 중</div>
                <div class="card-content">
                    <h3 class="title">{{ movie.title }}</h3>
                    <p class="release-date" v-if="movie.release_date">📅 개봉일: {{ movie.release_date }}</p>
                    <p class="rating">⭐ {{ movie.vote_average.toFixed(1) }} / 10</p>
                    <p class="overview">{{
                        movie.overview
                            ? movie.overview.substring(0, 60) + '...'
                            : '국내에 등록된 줄거리 요약 정보가 없습니다.'
                        }}</p>
                    <button @click="store.toggleFavorite(movie.id)" class="fav-btn"
                        :class="{ active: store.favoriteMovieIds.has(movie.id) }">
                        {{ store.favoriteMovieIds.has(movie.id) ? '💖 찜 해제' : '🤍 찜하기' }}
                    </button>
                </div>
                <RouterLink :to="`/movies/${movie.id}`" class="stretched-link"
                    :aria-label="`${movie.title} 상세 정보 보기`" />
            </div>
        </div>
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

.sub-title {
    font-size: 14px;
    color: #7f8c8d;
    margin-top: 5px;
}

.status-message {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    padding: 50px;
    border-radius: 12px;
}

.loading {
    color: #3498db;
    background-color: #e3f2fd;
}

.error {
    color: #e74c3c;
    background-color: #fdeaea;
}

.movie-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 30px;
}

.movie-card {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    background: white;
    text-align: left;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease;
    display: flex;
    flex-direction: column;
}

.movie-card:hover {
    transform: translateY(-5px);
}

.poster {
    width: 100%;
    height: 380px;
    object-fit: cover;
}

.poster-placeholder {
    width: 100%;
    height: 380px;
    background-color: #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #7f8c8d;
    font-weight: bold;
}

.card-content {
    padding: 20px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.title {
    font-size: 18px;
    color: #333;
    margin: 0 0 6px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: bold;
}

.release-date {
    font-size: 13px;
    color: #7f8c8d;
    margin-bottom: 10px;
    font-weight: 500;
}

.rating {
    font-weight: bold;
    color: #f39c12;
    margin-bottom: 10px;
    font-size: 16px;
}

.overview {
    font-size: 13px;
    color: #555;
    line-height: 1.4;
    margin-bottom: 20px;
    flex-grow: 1;
}

.fav-btn {
    position: relative;
    width: 100%;
    z-index: 2;
    padding: 12px;
    cursor: pointer;
    border: none;
    background: #ecf0f1;
    color: #333;
    border-radius: 8px;
    font-weight: bold;
    /* 원본의 오타 유지 (필요 시 font-weight로 수정 가능) */
    font-size: 14px;
    transition: 0.3s;
    margin-top: auto;
}

.fav-btn.active {
    background: #ff4757;
    color: white;
}

/* ➕ [12주차 추가] 카드 껍데기를 가상으로 100% 덮는 투명 링크 스타일 */
.stretched-link {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    /* 층위 레이어 1단계 설정 */
}
</style>