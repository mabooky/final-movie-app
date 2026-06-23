<script setup>
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';

onMounted(() => {
    document.title = 'NETVUE — 당신만의 영화 컬렉션';
});
</script>

<template>
    <main class="hero">
        <!-- 배경 오버레이 -->
        <div class="hero__bg">
            <div class="hero__gradient"></div>
            <div class="hero__noise"></div>
        </div>

        <!-- 중앙 콘텐츠 -->
        <div class="hero__content">
            <div class="hero__badge">🍿 Premium Movie Platform</div>

            <h1 class="hero__title">
                <span class="hero__title-line">당신의 취향을</span>
                <span class="hero__title-line hero__title-line--accent">완성하는 영화 공간</span>
            </h1>

            <p class="hero__desc">
                2025년 이후 국내 개봉작부터 숨은 명작까지.<br>
                취향에 꼭 맞는 영화를 발견하고, 나만의 컬렉션을 만들어보세요.
            </p>

            <div class="hero__actions">
                <RouterLink to="/movies" class="hero__btn hero__btn--primary">
                    <span class="hero__btn-icon">🎬</span>
                    <span>영화 둘러보기</span>
                </RouterLink>
                <RouterLink to="/favorites" class="hero__btn hero__btn--secondary">
                    <span class="hero__btn-icon">💖</span>
                    <span>찜 목록 보기</span>
                </RouterLink>
            </div>

            <div class="hero__stats">
                <div class="hero__stat">
                    <span class="hero__stat-value">200개</span>
                    <span class="hero__stat-label">전체 영화</span>
                </div>
                <div class="hero__stat-divider"></div>
                <div class="hero__stat">
                    <span class="hero__stat-value">실시간</span>
                    <span class="hero__stat-label">인기 순위</span>
                </div>
                <div class="hero__stat-divider"></div>
                <div class="hero__stat">
                    <span class="hero__stat-value">AI</span>
                    <span class="hero__stat-label">맞춤 추천</span>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
/* ── Hero 섹션 ── */
.hero {
    position: relative;
    min-height: calc(100vh - 80px); /* 헤더 높이 제외 */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background-color: #0c1014;
    user-select: none;
}

/* ── 배경 레이어 ── */
.hero__bg {
    position: absolute;
    inset: 0;
    z-index: 0;
}

.hero__gradient {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255, 71, 87, 0.08) 0%, transparent 70%),
        radial-gradient(ellipse 60% 50% at 80% 80%, rgba(255, 71, 87, 0.04) 0%, transparent 70%),
        radial-gradient(ellipse 50% 40% at 20% 20%, rgba(255, 107, 129, 0.03) 0%, transparent 70%);
}

.hero__noise {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E");
    opacity: 0.5;
}

/* ── 콘텐츠 ── */
.hero__content {
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 0 24px;
    max-width: 720px;
}

/* ── 상단 배지 ── */
.hero__badge {
    display: inline-block;
    padding: 8px 20px;
    border: 1px solid rgba(255, 71, 87, 0.3);
    border-radius: 50px;
    color: #ff6b81;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
    margin-bottom: 36px;
    background: rgba(255, 71, 87, 0.06);
    backdrop-filter: blur(4px);
    animation: fadeInDown 0.8s ease-out;
}

/* ── 타이틀 ── */
.hero__title {
    margin: 0 0 28px 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.hero__title-line {
    font-size: clamp(36px, 7vw, 64px);
    font-weight: 900;
    color: #ffffff;
    line-height: 1.15;
    letter-spacing: -1.5px;
    animation: fadeInUp 0.8s ease-out 0.15s both;
}

.hero__title-line--accent {
    background: linear-gradient(135deg, #ff4757 0%, #ff6b81 40%, #ff8c9e 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 0 30px rgba(255, 71, 87, 0.5));
    animation: fadeInUp 0.8s ease-out 0.3s both;
}

/* ── 설명 ── */
.hero__desc {
    font-size: 17px;
    color: #8899aa;
    line-height: 1.75;
    margin: 0 0 44px 0;
    animation: fadeInUp 0.8s ease-out 0.45s both;
}

/* ── CTA 버튼 ── */
.hero__actions {
    display: flex;
    gap: 14px;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 56px;
    animation: fadeInUp 0.8s ease-out 0.6s both;
}

.hero__btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 16px 32px;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
}

.hero__btn--primary {
    background: linear-gradient(135deg, #ff4757, #ff6b81);
    color: #ffffff;
    box-shadow:
        0 4px 24px rgba(255, 71, 87, 0.35),
        0 0 60px rgba(255, 71, 87, 0.1);
}

.hero__btn--primary:hover {
    transform: translateY(-3px);
    box-shadow:
        0 8px 32px rgba(255, 71, 87, 0.5),
        0 0 80px rgba(255, 71, 87, 0.2);
}

.hero__btn--secondary {
    background: transparent;
    color: #ced5e0;
    border: 2px solid rgba(255, 255, 255, 0.12);
}

.hero__btn--secondary:hover {
    color: #ffffff;
    border-color: rgba(255, 71, 87, 0.4);
    background: rgba(255, 71, 87, 0.06);
    transform: translateY(-3px);
    box-shadow: 0 0 32px rgba(255, 71, 87, 0.1);
}

.hero__btn-icon {
    font-size: 18px;
    line-height: 1;
}

/* ── 통계 ── */
.hero__stats {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 32px;
    animation: fadeInUp 0.8s ease-out 0.75s both;
}

.hero__stat {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.hero__stat-value {
    font-size: 20px;
    font-weight: 800;
    color: #ffffff;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.15);
}

.hero__stat-label {
    font-size: 12px;
    color: #5a6678;
    font-weight: 500;
    letter-spacing: 0.3px;
    text-transform: uppercase;
}

.hero__stat-divider {
    width: 1px;
    height: 40px;
    background: rgba(255, 255, 255, 0.08);
}

/* ── 키프레임 애니메이션 ── */
@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-16px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(16px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes float {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(8px); }
}
</style>