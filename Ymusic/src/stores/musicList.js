import { ref, reactive } from 'vue'
import { defineStore } from "pinia";

export const useMusicList = defineStore('musicLst', {
    state: () => ({
        list: reactive([]), // 各种歌的存储
        playList: reactive([]), // 播放列表存储
        history: reactive([]), // 历史播放存储
        favorites: reactive([]), // 收藏夹存储
        playBackmusic: ref([]) // 正在播放
    }),
    persist: true, // 永久化存储
});