<template>
    <div id="touchMenu" class="context-menu">
        <teleport to='body'>
            <div class="bg"></div>
        </teleport>
        <div class="context">
            <div class="img"><img :src="meun.albumimg" alt=""></div>
            <div class="text">
                <div class="name">{{ meun.name }}</div>
                <div class="singer">{{ meun.singer }}</div>
            </div>
        </div>
        <div class="play button" @click="play(meun)">
            <IconPlayArrowFill class="icon" />立刻播放
        </div>
        <div class="add button" @click="updateSong(meun)">
            <IconSkipNextFill class="icon" />添加下一首
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useMusicList } from '@/stores/musicList';
import { IconPlayArrowFill, IconSkipNextFill } from '@arco-design/web-vue/es/icon';

const props = defineProps({
    meun: Object,
});

// 导入储存库
const musicList = useMusicList();

// 控制右键菜单

// 添加歌曲
const updateSong = (value) => {
    // 删除原歌曲所在位置
    musicList.playList = musicList.playList.filter(song => song.id !== value.id);
    // 添加到新的位置
    musicList.playList.splice(musicList.playList.findIndex(song => song.id === musicList.playBackmusic.id) + 1, 0, { ...value });
};

// 立刻播放
const play = (value) => {
    if (musicList.playBackmusic.id == value.id) return
    updateSong(value);
    musicList.playBackmusic = { ...value }; // 选中播放
};
</script>

<style lang="scss" scoped>
.bg {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    width: 100dvw;
    height: 100dvh;
    background-color: rgba($color: #000000, $alpha: 0.5);
    z-index: 3;
}

#touchMenu {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 300px;
    z-index: 4;
    background-color: #fff;
    padding: 10px;
    border-radius: 15px 15px 0 0;

    .context {
        display: flex;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #ccc;

        .img {
            width: 75px;
            height: 75px;

            img {
                width: 100%;
                height: 100%;
            }
        }

        .text {
            margin-left: 10px;

            .name {
                font-size: 20px;
                margin-bottom: 5px;
            }
        }
    }

    .button {
        display: flex;
        align-items: center;
        margin: 10px 0;
        cursor: pointer;
        height: 35px;
        font-size: 16px;

        .icon {
            font-size: 24px;
            margin-right: 10px;
        }

        &:hover {
            background-color: rgba(39, 46, 59, 0.08);
        }
    }
}
</style>