import { ref, reactive } from 'vue'
import { defineStore } from "pinia";

export const wyySongSheet = defineStore('wyySongSheet', {
    state: () => ({
        // 网易云信息存储
        wyy: reactive({
            id: undefined,
            name: undefined,
            avatar: undefined
        }),
        menu: ref(undefined), // 选中导航栏存储
        // 首页歌单存储
        list: reactive([
            { imgUrl: './img/history.png', name: '历史播放', songSheetId: 'history' },
            { imgUrl: './img/Favorites.png', name: '收藏夹', songSheetId: 'favorites' }
        ]),
        musicLoadding: true // 加载专辑或搜索显示
    }),
    persist: true, // 永久化存储
});