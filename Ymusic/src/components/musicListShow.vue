<template>
    <div id="musicList">
        <div class="musicMessage el-row">
            <div class="el-col el-col-1"></div>
            <div class="el-col el-col-10">音乐标题</div>
            <div class="el-col el-col-6">歌手</div>
            <div class="el-col el-col-7">专辑</div>
        </div>
        <el-skeleton :loading="SongSheet.musicLoadding" animated style="margin-top: 15px;">
            <template #template>
                <el-skeleton-item variant="text" v-for="item in 5" style="height: 38px; margin: 10px;" />
            </template>
            <template #default>
                <div class="musicSong">
                    <div v-if="!list" class="nullMusic">暂无内容,请搜索</div>
                    <!-- 右键菜单内容范围 -->
                    <rightMenu :meun="musicValue">
                        <div class="el-row" v-for="item in list" :key="item.id"
                            :class="{ 'musicList-active': item.id === musicList.playBackmusic.id }"
                            @contextmenu.prevent="editMusicValue(item)" @dblclick="handleDoubleClick(item)">
                            <div class="el-col el-col-1 albumimg"><img v-lazy="item.albumimg" alt=""></div>
                            <div class="el-col el-col-10 text">{{ item.name }}</div>
                            <div class="el-col el-col-6 text singer">{{ item.singer }}</div>
                            <div class="el-col el-col-7 text albumName">{{ item.albumName }}</div>
                            <div class="meun" @click="showContextMenu(item)">
                                <IconMore />
                            </div>
                        </div>
                    </rightMenu>
                    <!-- 右键菜单内容范围 -->
                </div>
            </template>
        </el-skeleton>
    </div>
    <transition name="fadePlay">
        <touchMenu v-if="showMenu" :meun="musicItem" />
    </transition>
</template>

<script setup>
import { reactive, defineProps } from 'vue';
import { wyySongSheet } from '@/stores/wyySongSheet';
import { useMusicList } from '@/stores/musicList';
import rightMenu from './rightMenu.vue';
import { IconMore } from "@arco-design/web-vue/es/icon"
import touchMenu from './touchMenu.vue';
import usetouchMenu from '@/assets/js/touchMenu';

// 导入存储库
const SongSheet = wyySongSheet()
const musicList = useMusicList()
const { showMenu, musicItem, showContextMenu } = usetouchMenu();


// 获取父组件传入的数据
const props = defineProps({
    list: Array,
});

// 把选中歌曲信息，给musicValue传给子组件
let musicValue = reactive({})
const editMusicValue = (item) => {
    Object.assign(musicValue, item);
}

// 双击添加全部歌曲
const handleDoubleClick = (data) => {
    musicList.playList = props.list.map(item => ({ ...item }));
    musicList.playBackmusic = data; // 选择播放的歌
};

</script>

<style lang="scss" scoped>
@use '../assets/css//musicStyle.scss' as *;

#musicList {
    width: 85%;
    margin-top: 25px;
    font-size: 14px;
    padding-bottom: 120px;

    .musicMessage {
        justify-content: left;
        color: #86909c;
    }

    .musicSong {
        margin-top: 15px;

        .nullMusic {
            font-size: 50px;
            text-align: center;
        }

        .el-row {
            position: relative;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;

            .albumimg {
                width: 100%;
                font-size: 0;

                img {
                    width: 65%;
                    height: 100%;
                    aspect-ratio: 1 / 1;
                    object-fit: cover;
                }
            }

            .text {
                display: flex;
                align-items: center;
            }

            .meun {
                display: none;
                position: absolute;
                top: 50%;
                right: 10px;
                transform: translateY(-50%)
            }

            &:hover {
                background-color: #dddddd;
            }

            &.musicList-active:hover {
                background-color: #2ECC71;
            }
        }
    }

    @include respond-to() {
        .musicMessage {

            .el-col-1 {
                width: 36px;
                max-width: 36px;
                margin: 0 10px;
                flex: auto;
            }

            .el-col-7,
            .el-col-6 {
                display: none;
            }
        }

        .musicSong {
            .nullMusic {
                font-size: 36px;
            }

            .el-row {
                margin-bottom: 10px;
                padding: 10px 0;

                .albumimg {
                    width: 36px;
                    height: 36px;
                    max-width: 36px;
                    margin: 0 10px;

                    img {
                        width: 36px;
                        height: 36px;
                    }
                }

                .text {
                    font-size: 14px;
                    @include textLineNum(1);
                    line-height: 36px;
                }

                .singer {
                    display: none;
                }

                .albumName {
                    display: none;
                }

                .meun {
                    display: block;
                }
            }
        }
    }
}
</style>