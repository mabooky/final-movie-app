import { Success, Failure } from "@/utils/Result";
import axios from "axios";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

const LOCAL_STORAGE_FAVORITE_MOVIE_IDS_KEY = 'final-movie-app:favorite-movies-ids';

export const useMovieStore = defineStore('movie', () => {
    // 1. States
    const movies = ref([]);
    const storedFavoriteIds = localStorage.getItem(LOCAL_STORAGE_FAVORITE_MOVIE_IDS_KEY);
    /**
     * 찜한 영화들의 ID를 모아둔 Set 객체입니다.
     * @type {Set<number>}
     */
    const favoriteMovieIds = ref(new Set(storedFavoriteIds ? JSON.parse(storedFavoriteIds) : []));

    // favoriteMovieIds가 변경될 때마다 LocalStorage 업데이트
    watch(
        favoriteMovieIds,
        (newIdSet) => {
            const newIdArray = Array.from(newIdSet);
            localStorage.setItem(LOCAL_STORAGE_FAVORITE_MOVIE_IDS_KEY, JSON.stringify(newIdArray));
        },
        { deep: true } // Set 내부의 변경도 감지하려면 deep 옵션 필요
    );

    // 2. Getters
    const favoriteMoviesAvgRating = computed(() => {
        if (favoriteMovieIds.value.size === 0) return 0;

        const favoriteMovies = movies.value.filter(movie => favoriteMovieIds.value.has(movie.id));
        const totalRating = favoriteMovies.reduce((sum, movie) => sum + movie.vote_average, 0);
        return totalRating / favoriteMovies.length;
    })

    // 3. Actions
    async function fetchMovies(page = 1) {
        try {
            const params = {
                api_key: import.meta.env.VITE_TMDB_API_KEY,
                language: 'ko-KR',
                region: 'KR',
                sort_by: 'popularity.desc',
                include_adult: false,
                'release_date.gte': '2025-01-01',
                with_release_type: '2|3',
                page: page
            };

            const response = await axios.get('https://api.themoviedb.org/3/discover/movie', { params });
            
            // 2XX 응답 (요청 성공)
            const data = response.data.results;
            movies.value = data;
            return new Success(data);
        }
        catch (error) {
            return new Failure(error.response?.data?.status_message || error.message || '알 수 없는 오류')
        }
    }

    function toggleFavorite(movieId) {
        if (favoriteMovieIds.value.has(movieId)) {
            favoriteMovieIds.value.delete(movieId);
        }
        else {
            favoriteMovieIds.value.add(movieId);
        }
    }

    async function fetchMovieDetails(movieId) {
        try {
            const params = {
                api_key: import.meta.env.VITE_TMDB_API_KEY,
                language: 'ko-KR'
            }

            const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, { params });
            
            // 2XX 응답 (요청 성공)
            return new Success(response.data);
        }
        catch (error) {
            return new Failure(error.response?.data?.status_message || error.message || '알 수 없는 오류');
        }
    }

    return { 
        movies, favoriteMovieIds,
        favoriteMoviesAvgRating,
        fetchMovies, toggleFavorite, fetchMovieDetails 
    };
});