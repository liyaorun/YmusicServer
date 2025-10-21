<template>
    <div id="home" style="margin-top: 65px;">
        <div class="musiclist">
            <div class="item" v-for="(item, index) in SongSheet.list" :key="index"
                @click="goSongSheet(item.songSheetId)">
                <div class="img"><img :src="item.imgUrl" alt=""></div>
                <div class="text">{{ item.name }}</div>
            </div>
        </div>
        <div class="playlist">
            <p>{{ wyyMusicListStatus.text }}</p>
            <input type="button" :value="'[添加]'" @click="addWyyMusicSongSheet"
                v-show="!wyyMusicListStatus.aWMSShot"></input>
            <input type="button" :value="'[刷新]'" @click="refreshWyyMusicSongSheet(SongSheet.wyy.id)"
                v-show="wyyMusicListStatus.aWMSShot"></input>
            <input type="button" :value="'[退出]'" @click="quitWyyMusicSongSheet(undefined, undefined, undefined)"
                v-show="wyyMusicListStatus.aWMSShot"></input>
        </div>
    </div>
</template>

<script setup>
import router from '@/router';
import { wyySongSheet } from '@/stores/wyySongSheet';
import { detectionWyyUesrId, addWyyMusicSongSheet, refreshWyyMusicSongSheet, quitWyyMusicSongSheet, wyyMusicListStatus } from '@/assets/js/addWyyMusic';

// 获取存储的网易云信息
const SongSheet = wyySongSheet()

//点击专辑后跳转
const goSongSheet = (songSheetId) => {
    const path = `/songSheet?id=${songSheetId}`;
    router.replace(SongSheet.menu = path);
}

// 初始化
detectionWyyUesrId()
</script>

<style lang="scss" scoped>
@use '../assets/css/musicStyle.scss' as *;

p {
    margin: 0;
}

#home {
    position: relative;
    padding: 0 30px;
    user-select: none;

    .musiclist {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 25px;
        width: 100%;
        margin-bottom: 50px;

        .item {
            @include flexCenter;
            flex-direction: column;
            width: 100%;
            cursor: pointer;

            img {
                width: 100%;
            }

            .text {
                @include textLineNum(1);
                font-size: 14px
            }
        }
    }

    .playlist {
        @include flexCenter;
        background-color: #e5e6eb;
        width: 100%;
        padding: 10px;
        margin-bottom: 130px;

        input {
            border: 0;
            color: #000;
            background-color: #e5e6eb;
            font-size: 16px;
            padding: 0;
            cursor: pointer;

            &:hover {
                color: #409eff;
            }
        }
    }

    @include respond-to() {
        & {
            padding-bottom: 120px;
        }
    }
}
</style>