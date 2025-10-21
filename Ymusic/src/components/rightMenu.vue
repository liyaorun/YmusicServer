<template>
    <div ref="containerRef" @contextmenu="showContextMenu">
        <slot></slot>
        <teleport to="body">
            <div id="rightMenu" v-if="showMenu" :style="{ top: y + 'px', left: x + 'px' }" class="context-menu">
                <div class="context">
                    <div class="img"><img :src="meun.albumimg" alt=""></div>
                    <div class="name">{{ meun.name }}</div>
                </div>
                <div class="play button" @click="play(meun)">
                    <IconPlayArrowFill class="icon" />立刻播放
                </div>
                <div class="add button" @click="updateSong(meun)">
                    <IconSkipNextFill class="icon" />添加下一首
                </div>
            </div>
        </teleport>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useMusicList } from '@/stores/musicList';
import useContextMenu from '@/assets/js/rightMenu';
import { IconPlayArrowFill, IconSkipNextFill } from '@arco-design/web-vue/es/icon';
import { ElMessage } from 'element-plus'


const props = defineProps({
    meun: Object,
});

// 导入储存库
const musicList = useMusicList();

// 控制右键菜单
const { showMenu, x, y, showContextMenu } = useContextMenu();

// 添加歌曲
const updateSong = (value) => {
    // 删除原歌曲所在位置
    musicList.playList = musicList.playList.filter(song => song.id !== value.id);
    // 添加到新的位置
    musicList.playList.splice(musicList.playList.findIndex(song => song.id === musicList.playBackmusic.id) + 1, 0, { ...value });
    ElMessage('已添加到下一首播放')
};

// 立刻播放
const play = (value) => {
    if (musicList.playBackmusic.id == value.id) return
    updateSong(value);
    musicList.playBackmusic = { ...value }; // 选中播放
};
</script>

<style lang="scss" scoped>
#rightMenu {
    position: fixed;
    top: 0;
    left: 0;
    width: 200px;
    padding: 0px 10px;
    z-index: 2;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 7px;

    .context {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ccc;
        padding: 10px 0;

        .img {
            width: 36px;
            height: 36px;

            img {
                width: 100%;
                height: 100%;
            }
        }

        .name {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            margin-left: 10px;
        }
    }

    .button {
        display: flex;
        align-items: center;
        margin: 10px 0;
        height: 30px;
        padding: 5px 0;
        cursor: pointer;

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