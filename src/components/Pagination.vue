<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
    currentPage: {
        type: Number,
        required: true,
    },
    totalPages: {
        type: Number,
        required: true,
    },
});

const emit = defineEmits(['page-change']);

const GROUP_SIZE = 10;

// 현재 보여줄 페이지 그룹의 시작 번호
const groupStart = ref(Math.floor((props.currentPage - 1) / GROUP_SIZE) * GROUP_SIZE + 1);

// currentPage가 외부에서 바뀌면 groupStart도 따라감
watch(() => props.currentPage, (newPage) => {
    groupStart.value = Math.floor((newPage - 1) / GROUP_SIZE) * GROUP_SIZE + 1;
});

// 현재 그룹에 표시할 페이지 번호들
const visiblePages = computed(() => {
    const pages = [];
    const end = Math.min(groupStart.value + GROUP_SIZE - 1, props.totalPages);
    for (let i = groupStart.value; i <= end; i++) {
        pages.push(i);
    }
    return pages;
});

const isFirstGroup = computed(() => groupStart.value <= 1);
const isLastGroup = computed(() => groupStart.value + GROUP_SIZE - 1 >= props.totalPages);

function goTo(page) {
    if (page < 1 || page > props.totalPages) return;
    emit('page-change', page);
}

function jumpToFirstGroup() {
    groupStart.value = 1;
}

function jumpToPrevGroup() {
    groupStart.value = Math.max(1, groupStart.value - GROUP_SIZE);
}

function jumpToNextGroup() {
    groupStart.value = Math.min(
        Math.floor((props.totalPages - 1) / GROUP_SIZE) * GROUP_SIZE + 1,
        groupStart.value + GROUP_SIZE
    );
}

function jumpToLastGroup() {
    groupStart.value = Math.floor((props.totalPages - 1) / GROUP_SIZE) * GROUP_SIZE + 1;
}
</script>

<template>
    <nav class="pagination" aria-label="페이지 탐색">
        <!-- 첫 그룹으로 -->
        <button
            class="pagination__btn"
            :disabled="isFirstGroup"
            @click="jumpToFirstGroup"
            aria-label="첫 페이지 그룹"
        >
            «
        </button>

        <!-- 이전 그룹으로 -->
        <button
            class="pagination__btn"
            :disabled="isFirstGroup"
            @click="jumpToPrevGroup"
            aria-label="이전 페이지 그룹"
        >
            ‹
        </button>

        <!-- 페이지 번호 -->
        <button
            v-for="page in visiblePages"
            :key="page"
            class="pagination__btn"
            :class="{ 'pagination__btn--active': page === currentPage }"
            @click="goTo(page)"
            :aria-label="`${page} 페이지`"
            :aria-current="page === currentPage ? 'page' : undefined"
        >
            {{ page }}
        </button>

        <!-- 다음 그룹으로 -->
        <button
            class="pagination__btn"
            :disabled="isLastGroup"
            @click="jumpToNextGroup"
            aria-label="다음 페이지 그룹"
        >
            ›
        </button>

        <!-- 마지막 그룹으로 -->
        <button
            class="pagination__btn"
            :disabled="isLastGroup"
            @click="jumpToLastGroup"
            aria-label="마지막 페이지 그룹"
        >
            »
        </button>
    </nav>
</template>

<style scoped>
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    margin-top: 40px;
    flex-wrap: wrap;
}

.pagination__btn {
    min-width: 40px;
    height: 40px;
    padding: 0 12px;
    border: 2px solid #e0e4e8;
    border-radius: 10px;
    background: #ffffff;
    color: #5a6270;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
}

.pagination__btn:hover:not(:disabled) {
    border-color: #ff4757;
    color: #ff4757;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(255, 71, 87, 0.15);
}

.pagination__btn--active {
    background: linear-gradient(135deg, #ff4757, #ff6b81);
    border-color: transparent;
    color: #ffffff;
    box-shadow: 0 2px 12px rgba(255, 71, 87, 0.3);
}

.pagination__btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
}
</style>