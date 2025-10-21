import { ref, reactive } from 'vue'
import { defineStore } from "pinia";

export const useSetting = defineStore('setting', {
    state: () => ({
        menu: ref(undefined), // 选中导航栏存储
        musicLoadding: true, // 加载专辑或搜索显示
    }),
});