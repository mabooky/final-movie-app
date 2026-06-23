<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { useMovieStore } from './stores/movie';

const store = useMovieStore();
</script>

<template>
    <div class="app-container">
        <header class="main-header">
            <div class="header-content">
                <RouterLink to="/" class="logo-zone">
                    <span class="logo-icon">🍿</span>
                    <h1 class="logo-text">NETVUE</h1>
                </RouterLink>

                <nav class="nav-menu">
                    <RouterLink to="/" class="nav-item">홈</RouterLink>
                    <RouterLink to="/movies" class="nav-item">영화 목록</RouterLink>
                </nav>

                <RouterLink to="/favorites" class="badge">
                    <span class="badge__label">❤️ 찜한 작품</span>
                    <span class="badge__value">{{ store.favoriteMovies.length }}개</span>

                    <div class="badge__divider"></div>

                    <span class="badge__label">⭐ 평균 평점</span>
                    <span class="badge__value badge__value--rating">
                        {{ store.favoriteMoviesAvgRating.toFixed(1) }} / 10
                    </span>
                </RouterLink>
            </div>
        </header>

        <main class="main-content">
            <!-- KeepAlive를 활용하여 MoviesView와 FavoriteMoviesView 컴포넌트를 캐싱합니다. -->
            <RouterView v-slot="{ Component }">
                <KeepAlive :include="['MoviesView', 'FavoriteMoviesView']">
                    <component :is="Component" />
                </KeepAlive>
            </RouterView>
        </main>
    </div>
</template>

<style>
body {
    margin: 0;
}
</style>

<style scoped>
.app-container {
    font-family: "Noto Sans KR", sans-serif;
    background-color: #f8f9fa;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.main-header {
    background-color: #1e272e;
    color: #ffffff;
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    padding: 0 40px;
}

.header-content {
    max-width: 1200px;
    margin: 0 auto;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.logo-zone {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    color: #ffffff;
}

.logo-icon {
    font-size: 28px;
}

.logo-text {
    font-size: 22px;
    font-weight: 900;
    letter-spacing: -0.5px;
    background: linear-gradient(45deg, #ff4757, #ff6b81);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.nav-menu {
    display: flex;
    gap: 30px;
}

.nav-item {
    color: #ced5e0;
    text-decoration: none;
    font-size: 16px;
    font-weight: 700;
    transition: color 0.2s ease;
    padding: 8px 12px;
    border-radius: 6px;
}

.nav-item:hover {
    color: #ffffff;
    background-color: rgba(255, 255, 255, 0.05);
}

.router-link-active.nav-item {
    color: #ff4757;
    background-color: rgba(255, 87, 87, 0.1);
}

.badge {
    position: relative;
    display: flex;
    padding: 8px 18px;
    border-radius: 30px;
    background-color: #2f3542;
    border: 1px solid #3f4656;
    cursor: pointer;
    flex-direction: row;
    align-items: stretch;
    gap: 8px;
    text-decoration: none;
    transition: background-color 0.2s ease, border-color 0.2s ease;
}

.badge::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: #ffffff;
    opacity: 0;
    z-index: 1;
}

.badge:hover::after {
    opacity: 0.05;
}

.badge.router-link-active {
    background-color: #3d2330;
    border-color: #ff4757;
    box-shadow: 0 0 12px rgba(255, 71, 87, 0.25);
}

.badge__label {
    font-size: 13px;
    color: #a4b0be;
    font-weight: 500;
}

.badge__value {
    font-size: 14px;
    font-weight: 800;
    color: #ffffff;
}

.badge__value--rating {
    color: #e1b12c;
}

.badge__divider {
    width: 1px;
    margin-inline: 4px;
    background-color: #3f4656;
}

.main-content {
    flex-grow: 1;
    width: 100%;
    box-sizing: border-box;
}
</style>