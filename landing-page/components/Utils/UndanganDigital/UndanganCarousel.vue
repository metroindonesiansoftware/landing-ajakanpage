<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const activeCategory = ref<number | null>(null);
const loading = ref(true);
const currentPage = ref(1);
const limit = 9;

const setActiveCategory = (categoryId: number) => {
    activeCategory.value = categoryId;
    currentPage.value = 1; // Reset ke halaman pertama saat kategori diubah
    refresh();
};

const props = defineProps({
    filter: {
        type: String,
    }
});
// Fetch data dari API
const { data: undangan, pending, refresh } = useFetch(() =>
    `https://ajakan.me/api/guest/themes?type=${props.filter}&limit=${limit}&page=${currentPage.value}`
);

const dataUndangan = computed(() => (undangan.value as { data: { themes: { data: any[] } } })?.data.themes.data || []);
const subThemes = computed(() => (undangan.value as { data: { sub_themes: any[] } })?.data.sub_themes || []);
const popularThemes = computed(() => (undangan.value as { data: { popular_themes_id: any[] } })?.data.popular_themes_id || []);

// Watch untuk state pending
watch(pending, (newPending) => {
    loading.value = newPending;
});

watch(() => props.filter, () => {
    currentPage.value = 1;
    activeCategory.value = null;
    refresh();
});

// Function untuk mendapatkan nama sub theme berdasarkan id
const getSubThemeName = (subThemeId: number) => {
    const subTheme = subThemes.value.find((sub) => sub.id === subThemeId);
    return subTheme ? subTheme.name : 'Unknown Sub Theme';
};

// Filtered data undangan berdasarkan activeCategory
const filteredDataUndangan = computed(() => {
    let filteredData = dataUndangan.value;
    if (activeCategory.value) {
        filteredData = filteredData.filter(item => item.sub_theme === activeCategory.value);
    } else if (activeCategory.value === 0) {
        filteredData = filteredData.filter(item => popularThemes.value.includes(item.id));
    }
    return filteredData.slice(0, limit); // Apply limit after filtering
});

const totalPages = computed(() => Math.ceil((undangan.value as { data?: { themes?: { last_page?: number } } })?.data?.themes?.last_page ?? 0 / limit));

watch(currentPage, () => {
    loading.value = true;
    refresh();
});

const changePage = (page: number) => {
    if (page > 0 && page <= totalPages.value) {
        currentPage.value = page;
    }
};
</script>

<template>
    <div class="relative px-2">
        <div v-if="loading" class="flex justify-center items-center h-48">
            <p>Loading...</p>
        </div>
        <div v-else class="flex flex-col">
            <!-- Category Filter -->
            <div v-if="props.filter === 'wedding'" class="mb-4 flex justify-between items-center">
                <div>&#8203;</div>
                <div class="flex overflow-x-auto space-x-2 w-64 lg:w-full lg:justify-center mx-4">
                    <button
                        v-for="subTheme in subThemes" :key="subTheme.id"
                        @click="setActiveCategory(subTheme.id)"
                        :class="{
                            'bg-[#0191D8] text-white text-xs': activeCategory === subTheme.id,
                            'bg-transparent border border-[#0191D8] text-[#0191D8] text-xs': activeCategory !== subTheme.id
                        }"
                        class="px-4 py-2 rounded-lg whitespace-nowrap">
                        {{ subTheme.name }}
                    </button>
                </div>
                <div>&#8203;</div>
            </div>
            <!-- End Category Filter -->

            <!-- Undangan Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                <div v-for="undangan in filteredDataUndangan" :key="undangan.id" class="w-full max-w-xs mx-auto">
                    <NuxtLink :to="`/`" class="block bg-transparent w-full rounded-none">
                        <NuxtImg :src="undangan.image" alt="Article Image" class="w-full h-auto object-cover rounded-xl max-h-48" />
                        <div class="p-3">
                            <p class="text-sm text-[#B7B7B7]">{{ getSubThemeName(undangan.sub_theme) }}</p>
                            <h3 class="text-md font-semibold py-2">{{ undangan.name }}</h3>
                            <button class="bg-[#0191D8] text-white font-normal rounded-lg focus:outline-none w-full py-2">
                                <Icon name="icon-park-outline:preview-open" class="text-lg text-white" />
                                Preview
                            </button>
                        </div>
                    </NuxtLink>
                </div>
            </div>
            <!-- Pagination -->
            <div class="flex justify-start items-center mt-8" v-if="totalPages > 1">
                <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                    class="px-4 py-2 bg-transparent text-gray-700 rounded-l disabled:opacity-50 disabled:cursor-not-allowed">
                    <Icon name="carbon:previous-outline" class="text-3xl" />
                </button>
                <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                    class="px-4 py-2  text-gray-700 rounded-r  disabled:opacity-50 disabled:cursor-not-allowed">
                    <Icon name="carbon:next-outline" class="text-3xl" />
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
/* Adjust the styles as needed */
.max-w-xs {
    max-width: 30rem;
    /* Adjust the max width */
}

.max-h-48 {
    max-height: 15rem;
    /* Adjust the max height */
}
</style>