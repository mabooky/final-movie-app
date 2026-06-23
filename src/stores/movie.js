import { Success, Failure } from "@/utils/Result";
import axios from "axios";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

const LOCAL_STORAGE_FAVORITE_MOVIES_KEY = 'final-movie-app:favorite-movies';

export const useMovieStore = defineStore('movie', () => {
    /* -------------------------------- 1. States ------------------------------- */
    const movies = ref([]);

    // favoriteMovies는 찜한 시점의 영화 정보 스냅샷 저장
    const storedFavoriteMovies = localStorage.getItem(LOCAL_STORAGE_FAVORITE_MOVIES_KEY);
    const favoriteMovies = ref(storedFavoriteMovies ? JSON.parse(storedFavoriteMovies) : []);

    watch(
        favoriteMovies, 
        (newValue) => {
            localStorage.setItem(LOCAL_STORAGE_FAVORITE_MOVIES_KEY, JSON.stringify(newValue));
        },
        { deep: true }
    );

    /* ------------------------------- 2. Getters ------------------------------- */
    const favoriteMoviesAvgRating = computed(() => {
        if (favoriteMovies.value.length === 0) return 0;

        const sum = favoriteMovies.value.reduce((acc, m) => acc + m.vote_average, 0);
        return sum / favoriteMovies.value.length;
    });

    /* ------------------------------- 3. Actions ------------------------------- */
    async function fetchMovies() {
        try {
            const fetchedMovies = [];
            for (let page = 1; page <= 10; page++) {
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
                fetchedMovies.push(...response.data.results);
            }

            movies.value = fetchedMovies;
            console.log(fetchedMovies.length);
            return new Success(fetchedMovies);
        }
        catch (error) {
            return new Failure(error.response?.data?.status_message || error.message || '알 수 없는 오류')
        }
    }

    function toggleFavorite(movie) {
        const index = favoriteMovies.value.findIndex(m => m.id === movie.id);
        if (index === -1) {
            favoriteMovies.value.push({ ...movie });
        } else {
            favoriteMovies.value.splice(index, 1);
        }
    }

    async function fetchMovieDetails(movieId) {
        try {
            const params = {
                api_key: import.meta.env.VITE_TMDB_API_KEY,
                language: 'ko-KR'
            }

            const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, { params });
            return new Success(response.data);
        }
        catch (error) {
            return new Failure(error.response?.data?.status_message || error.message || '알 수 없는 오류');
        }
    }

    return { 
        movies, favoriteMovies,
        favoriteMoviesAvgRating,
        fetchMovies, toggleFavorite, fetchMovieDetails 
    };
});