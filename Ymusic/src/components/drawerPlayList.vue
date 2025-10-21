<template>
    <div id="drawer">
        <div class="head">
            <div class="title">当前播放</div>
            <div class="context">
                <div class="text">共{{ musicList.playList.length }}首</div>
                <div class="Clear" @click="clear">清空列表</div>
            </div>
        </div>
        <div class="main" ref="mainRef">
            <el-scrollbar height="100%" ref="scrollbarRef">
                <div class="musicItem" v-for="(item, index) in musicList.playList" :key="index" :id="item.id"
                    :class="{ 'musicList-active': item.id === musicList.playBackmusic.id }"
                    @dblclick="handleDoubleClick(item)">
                    <div class="img"><img v-lazy="item.albumimg" alt=""></div>
                    <div class="text">
                        <div class="name">{{ item.name }}</div>
                        <div class="singer">{{ item.singer }}</div>
                    </div>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMusicList } from '@/stores/musicList';
import scrllbarShow from '@/assets/js/scrllbarShow';

// 引入储存库
const musicList = useMusicList()

// 双击事件
const handleDoubleClick = (data) => {
    musicList.playBackmusic = data; // 选择播放的歌
}

// 清空播放列表
const clear = () => {
    musicList.playList.length = 0
    musicList.playBackmusic = { id: null, name: null, singer: null, albumName: null, albumimg: null };
}

let mainRef = ref(null)
let scrollbarRef = ref(null)

scrllbarShow(scrollbarRef, mainRef, '.musicList-active', 0)
</script>

<style lang="scss" scoped>
@use '../assets/css/musicStyle.scss' as *;

#drawer {
    position: fixed;
    top: 63px;
    right: 0;
    background: rgba(48, 48, 48, 0.3);
    backdrop-filter: blur(10px);
    width: 400px;
    padding: 20px 15px;
    height: calc(100dvh - 170px);
    box-sizing: border-box;
    z-index: 2;
    border-radius: 16px 0 0 16px;

    .head {
        border-bottom: 1px solid #ccc;

        .title {
            font-size: 20px;
            font-weight: bold;
        }

        .context {
            @include flexJustify(space-between);
            font-size: 14px;
            margin: 10px 0;

            div {
                display: flex;
                align-items: center;
                height: 36px;
            }

            .Clear {
                padding: 0 12px;
                box-sizing: border-box;
                cursor: pointer;

                &:hover {
                    background-color: #ccc;
                }
            }
        }
    }

    .main {
        height: calc(100dvh - 270px);

        :deep(.el-scrollbar__view) {
            padding: 0;
        }

        .musicItem {
            display: flex;
            margin: 10px 0;
            padding: 10px;
            border-radius: 7px;

            .img {
                width: 36px;
                height: 36px;
                margin-right: 10px;

                img {
                    width: 36px;
                    height: 36px;
                }
            }

            .text {
                @include flexJustify(center);
                flex-direction: column;
                width: 100%;

                .name {
                    @include textLineNum(1);
                    font-size: 16px;
                    margin-bottom: 3px;
                }

                .singer {
                    font-size: 12px;
                }
            }
        }
    }
}
</style>