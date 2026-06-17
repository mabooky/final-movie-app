<script setup>
import { useMovieStore } from '@/stores/movie';
import { Failure, Success } from '@/utils/Result';
import axios from 'axios';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const store = useMovieStore();

const fetchResult = ref(null);
const movie = ref(null);
onMounted(async () => {
    document.title = '영화 상세정보 - NETVUE';
    window.scrollTo(0, 0); // 페이지 상단으로 스크롤 이동

    const movieId = route.params.id; // 주소창에서 ID 추출
    fetchResult.value = await store.fetchMovieDetails(movieId); // 스토어 단일 API 호출
    if (fetchResult.value && fetchResult.value instanceof Success) {
        movie.value = fetchResult.value.data;
        document.title = `${movie.value.title} - NETVUE`;
    }
});

const formattedBudget = computed(() => {
    return movie.value.budget !== 0 
        ? `$${movie.value.budget.toLocaleString('en-US')}` 
        : '공개되지 않음';
});

const formattedRevenue = computed(() => {
    return movie.value.revenue !== 0 
        ? `$${movie.value.revenue.toLocaleString('en-US')}` 
        : '집계되지 않음';
});

const aiReview = ref('');
const isAiLoading = ref(false);
async function generateAIReview() {
    isAiLoading.value = true;

    try {
        const prompt = '너는 40년 경력 이상의 전설적인 영화 평론 유튜버야. ' +
            '아래 영화 데이터를 기반으로 왜 사용자가 이 영화를 봐야하는지 설득하는 2-3문단 분량의 상세하고 ' + 
            '흡입력 있는 추천평을 작성해줘(이모지 필수). 단, 네가 40년 이상의 경력을 가졌다는 사실은 언급하지 마.\n' +
            `제목: ${movie.value.title}\n` +
            `장르: ${movie.value.genres.map(g => g.name).join(', ')}\n` +
            `평점: ${movie.value.vote_average.toFixed(1)} / 10`;

        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: 'openai/gpt-oss-20b',
                messages: [{ role: 'user', content: prompt }]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_AI_API_KEY}`
                }
            }
        );

        let reviewInnerHTML = response.data.choices[0].message.content
            .replace(/\n/g, '<br>'); // 줄바꿈 HTML로 변환
        let willOpenTag = true;
        while (true) {
            const nextDoubleAsteriskIndex = reviewInnerHTML.indexOf('**');
            if (nextDoubleAsteriskIndex === -1) break;

            const tag = willOpenTag ? '<strong>' : '</strong>';
            reviewInnerHTML = reviewInnerHTML.replace('**', tag);
            willOpenTag = !willOpenTag;
        }

        aiReview.value = reviewInnerHTML;
    }
    catch (error) {
        aiReview.value = '🚨 AI 추천사 생성 중 오류가 발생했습니다.<br><br>상세 오류 메시지: ' + 
            (error.response?.data?.error || error.message || '알 수 없는 오류');
    }
    finally {
        isAiLoading.value = false;
    }
}
</script>

<template>
    <div v-if="!fetchResult" class="full-screen-loading-gate">
        <div class="loading-spinner"></div>
        <p class="loading-text">시네마틱 데이터 센터로부터 초고화질 상세 정보를 퍼 올리는 중입니다...</p>
    </div>

    <main v-else-if="fetchResult && fetchResult instanceof Success" class="detail-page">
        <div class="backdrop-layer"
            :style="{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }">
            <div class="black-curtain"></div>
        </div>
        <div class="content-container">
            <button @click="router.back" class="back-floating-btn">↩ 영화 목록으로 돌아가기</button>
            <div class="movie-hero-grid">
                <div class="poster-zone">
                    <img v-if="movie.poster_path"
                        :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
                        class="main-poster" />
                    <div v-else class="poster-placeholder">포스터 이미지 없음</div>
                </div>
                <div class="info-zone">
                    <h1 class="movie-main-title">{{ movie.title }}</h1>
                    <p class="tagline" v-if="movie.tagline">"{{ movie.tagline }}"</p>
                    <div class="meta-dashboard">
                        <span class="badge rating">⭐ {{ movie.vote_average.toFixed(1) }} / 10</span>
                        <span class="badge runtime">⏱ {{ movie.runtime }}분</span>
                        <span class="badge release">🗓 {{ movie.release_date }} 개봉</span>
                    </div>
                    <div class="genres-wrapper">
                        <span v-for="genre in movie.genres" :key="genre.id" class="genre-tag">
                            {{ genre.name }}
                        </span>
                    </div>
                    <div class="financial-box">
                        <div class="financial-item">
                            <span class="f-label">총 제작비</span>
                            <span class="f-value budget-color">{{ formattedBudget }}</span>
                        </div>
                        <div class="financial-item">
                            <span class="f-label">글로벌 흥행 수익</span>
                            <span class="f-value revenue-color">{{ formattedRevenue }}</span>
                        </div>
                    </div>
                    <div class="synopsis-container">
                        <h3 class="synopsis-title">시놉시스 줄거리</h3>
                        <p class="synopsis-text">
                            {{ movie.overview || '정식 등록된 줄거리 정보가 존재하지 않습니다.' }}
                        </p>
                    </div>

                    <hr class="divider">

                    <div class="ai-section">
                        <button @click="generateAIReview" class="ai-btn" :disabled="isAiLoading">
                            {{ isAiLoading ? '🤖 생성 중...' : '✨ AI 맞춤 추천사 듣기' }}
                        </button>

                        <div v-if="aiReview" class="ai-result-box">
                            <p v-html="aiReview"></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <div v-else-if="fetchResult && fetchResult instanceof Failure" class="full-screen-error-gate">
        <span class="error-icon">🚨</span>
        <h2 class="error-title">시스템 경고가 발생했습니다</h2>
        <p class="error-msg">상세 오류 메시지: {{ fetchResult.errorMessage }}</p>
        <button @click="router.push('/movies')" class="error-return-btn">안전한 영화 목록 페이지로 도망치기</button>
    </div>
</template>

<style scoped>
/* 페이지 전체 다크 모드 및 배경 스냅샷 연출 */
.detail-page {
    position: relative;
    min-height: 100vh;
    color: #ffffff;
    background-color: #0c1014;
    overflow: clip;
}

.backdrop-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center top;
    z-index: 0;
    transform: scale(1.05);
    filter: blur(4px);
}

.black-curtain {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, #0c1014 25%, rgba(12, 16, 20, 0.8) 60%, #0c1014 100%), linear-gradient(to bottom, transparent 50%, #0c1014 100%);
}

/* 중앙 정렬 콘텐츠 컨테이너 및 그리드 배치 */
.content-container {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 50px 30px;
}

.back-floating-btn {
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #ffffff;
    padding: 12px 24px;
    border-radius: 40px;
    cursor: pointer;
    font-weight: 700;
    font-size: 15px;
    margin-bottom: 40px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.back-floating-btn:hover {
    background: #ff4757;
    color: #fff;
    transform: translateY(-3px);
    border-color: #ff4757;
}

.movie-hero-grid {
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: 60px;
    align-items: start;
    margin-top: 20px;
}

.poster-zone {
    min-width: 0px;
}

/* 타이틀, 포스터, 배지 등 주요 컴포넌트 CSS */
.main-poster {
    width: 100%;
    border-radius: 20px;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.15);
}

.poster-placeholder {
    width: 100%;
    height: 500px;
    background-color: #222;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    font-weight: bold;
}

.movie-main-title {
    font-size: 52px;
    font-weight: 900;
    letter-spacing: -1.5px;
    margin: 0 0 10px 0;
    line-height: 1.2;
}

.tagline {
    font-size: 20px;
    font-style: italic;
    color: #a4b0be;
    margin-bottom: 30px;
    padding-left: 5px;
    border-left: 3px solid #747d8c;
}

.meta-dashboard {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 30px;
}

.badge {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 8px 18px;
    border-radius: 30px;
    font-size: 15px;
    font-weight: 700;
}

.rating {
    color: #ffa502;
    background: rgba(255, 165, 2, 0.1);
    border-color: rgba(255, 165, 2, 0.2);
}

.genres-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 40px;
}

.genre-tag {
    background: #1e272e;
    padding: 6px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #ced6e0;
    border: 1px solid #3d4852;
}

/* 재무 및 시놉시스 상자 */
.financial-box {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    background: rgba(0, 0, 0, 0.4);
    padding: 20px;
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    margin-bottom: 40px;
}

.financial-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.f-label {
    font-size: 13px;
    color: #747d8c;
    font-weight: 700;
}

.f-value {
    font-size: 22px;
    font-weight: 800;
    font-family: monospace;
}

.budget-color {
    color: #575fcf;
}

.revenue-color {
    color: #0be881;
}

.synopsis-container {
    display: flex;
    flex-direction: column;
}

.synopsis-title {
    font-size: 24px;
    font-weight: 800;
    margin: 0 0 20px 0;
    border-left: 5px solid #ff4757;
    padding-left: 15px;
    line-height: 1;
}

.synopsis-text {
    font-size: 17px;
    line-height: 1.8;
    color: #dcdde1;
    text-align: justify;
    margin: 0;
}

/* 로딩 게이트, 에러 게이트 및 애니메이션 */
.full-screen-loading-gate,
.full-screen-error-gate {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #0c1014;
    color: #ffffff;
    text-align: center;
}

.loading-spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(255, 255, 255, 0.08);
    border-top-color: #ff4757;
    border-radius: 50%;
    animation: spin 0.9s infinite linear;
    margin-bottom: 25px;
}

.loading-text,
.error-msg {
    font-size: 18px;
    font-weight: 700;
    color: #a4b0be;
}

.error-icon {
    font-size: 64px;
    margin-bottom: 20px;
}

.error-title {
    font-size: 28px;
    font-weight: 900;
    color: #ff4757;
    margin: 0 0 10px 0;
}

.error-return-btn {
    background: #ff4757;
    color: white;
    border: none;
    padding: 14px 32px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 5px 20px rgba(255, 71, 87, 0.4);
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 900px) {
    .movie-hero-grid {
        grid-template-columns: 1fr;
        gap: 40px;
        justify-items: center;
    }

    .poster-zone {
        width: 280px;
    }

    .movie-main-title {
        font-size: 38px;
        text-align: center;
    }

    .tagline {
        text-align: center;
        border-left: none;
    }
}

.divider {
    border: 0;
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
    margin: 30px 0;
}

.ai-section {
    margin: 30px 0;
    padding: 20px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.ai-btn {
    background: linear-gradient(45deg, #8a2be2, #4b0082);
    color: white;
    border: none;
    padding: 12px 20px;
    font-size: 16px;
    font-weight: bold;
    border-radius: 8px;
    cursor: pointer;
    width: 100%;
}

.ai-btn:disabled {
    background: rgb(99, 99, 99);
    pointer-events: none;
    color: #dcdde1;
}

.ai-result-box {
    margin-top: 15px;
    padding: 15px;
    background: #222;
    border-left: 4px solid #8a2be2;
    color: #fff;
    line-height: 1.6;
    font-family: serif;
}
</style>