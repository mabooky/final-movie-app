import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

export const useFavoritesStore = defineStore('favorites', () => {
    // 1. State (상태): 브라우저 스토리지에 저장된 데이터가 있으면 파싱해서 가져옵니다.
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const favoriteMovies = ref(savedFavorites);

    // 2. Getters (게터): 데이터를 계산해서 보여주는 안내원들
    // 2-1. 찜한 영화의 총 개수
    const totalFavorites = computed(() => favoriteMovies.value.length);

    // 2-2. [심화] 찜한 영화들의 평균 평점 계산 (reduce 활용)
    const averageRating = computed(() => {
        if (favoriteMovies.value.length === 0) return 0;
        const sum = favoriteMovies.value.reduce((acc, movie) => acc + movie.rating, 0);
        return (sum / favoriteMovies.value.length).toFixed(1); // 소수점 한 자리까지 표시
    });

    // 3. Actions (액션): 금고의 데이터를 수정할 수 있는 유일한 함수들
    const toggleFavorite = (movie) => {
        const index = favoriteMovies.value.findIndex(m => m.id === movie.id);
        if (index === -1) {
            // 영화가 찜 목록에 없으면 추가
            favoriteMovies.value.push(movie);
        } 
        else {
            // 영화가 찜 목록에 있으면 제거
            favoriteMovies.value.splice(index, 1);
        }
    };

    const clearAllFavorites = () => {
        favoriteMovies.value = [];
    };

    // 4. [핵심 실무] Watch를 이용한 영구 저장 로직
    // favoriteMovies 배열에 변화가 생길 때마다 브라우저 로컬 스토리지에 덮어씁니다.
    watch(
        favoriteMovies,
        (newVal) => {
            localStorage.setItem('favorites', JSON.stringify(newVal));
        },
        { deep: true }
    );

    // 컴포넌트들이 사용할 수 있도록 밖으로 꺼내줍니다.
    return { favoriteMovies, totalFavorites, averageRating, toggleFavorite, clearAllFavorites };
});