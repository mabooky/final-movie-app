import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMoviesStore = defineStore('movie', () => {
    // [1] State (상태 관리 구역)
    const movies = ref([]);

    // [세션 스토리지 적용]
    const favorites = ref(JSON.parse(sessionStorage.getItem('favorites')) || []);

    // [2] UX 및 예외 처리를 위한 핵심 방어 상태 변수
    const isLoading = ref(false);
    const errorMessage = ref('');

    // [3] Actions: 외부 서버 통신 함수 (async/await 적용)
    const fetchMovies = async () => {
        isLoading.value = true;
        errorMessage.value = '';

        try {
            const API_KEY = 'fcedda2b5954c45c578f6dc072005895';

            const movieParams = {
                api_key: API_KEY,
                language: 'ko-KR',
                region: 'KR',
                sort_by: 'popularity.desc',
                include_adult: false,
                'release_date.gte': '2025-01-01',
                with_release_type: '2|3',
                page: 1
            };

            const response = await axios.get('https://api.themoviedb.org/3/discover/movie', { params: movieParams });
            const fetchedMovies = response.data.results;

            // [세션 스토리지 상태 동기화]
            fetchedMovies.forEach(movie => {
                const isAlreadyFavorite = favorites.value.some(fav => fav.id === movie.id);
                movie.isFavorite = isAlreadyFavorite;
            });
            movies.value = fetchedMovies;
        } catch (error) {
            console.error('API 통신 에러 상세 내역: ', error);
            errorMessage.value = '영화 데이터를 불러오는 데 실패했습니다. 통신 상태나 API Key를 확인해주세요.';

        } finally {
            isLoading.value = false;
        }
    };

    // [찜하기 토글 및 세션 스토리지 반영 로직]
    const toggleFavorite = (movieId) => {
        const movie = movies.value.find(m => m.id === movieId);
        if (movie) {
            movie.isFavorite = !movie.isFavorite;
            // 하트 활성화 시 전역 찜 목록 금고 배열에 현재 영화 객체를 추가합니다.
            if (movie.isFavorite) {
                favorites.value.push(movie);
            } else {
                // 하트 해제 시 금고 배열에서 해당 영화를 제외(filter)시킵니다.
                favorites.value = favorites.value.filter(fav => fav.id !== movieId);
            }
            sessionStorage.setItem('favorites', JSON.stringify(favorites.value));
        }
    };

    const selectedMovie = ref(null);

    const fetchMovieDetail = async (movieId) => {
        isLoading.value = true;
        errorMessage.value = '';
        selectedMovie.value = null;

        try {
            const API_KEY = 'fcedda2b5954c45c578f6dc072005895';
            const url = `https://api.themoviedb.org/3/movie/${movieId}`;

            const response = await axios.get(url, {
                params: {
                    api_key: API_KEY,
                    language: 'ko-KR'
                }
            });
            selectedMovie.value = response.data;
        }
        catch (error) {
            if (error.response && error.response.status === 404) {
                errorMessage.value = '존재하지 않거나 삭제된 영화 정보입니다.';
            }
            else {
                errorMessage.value = '서버 통신 중 에러가 발생했습니다.'
            }
        }
        finally {
            isLoading.value = false;
        }
    }

    // [4] 컴포넌트가 사용할 수 있도록 상태와 함수들을 반환합니다.
    return {
        movies,
        favorites,
        isLoading,
        errorMessage,
        fetchMovies,
        toggleFavorite,
        selectedMovie,
        fetchMovieDetail
    }
});