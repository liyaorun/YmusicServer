<template>
    <div id="musicPlayShow"
        :style="{ backgroundImage: 'url(' + musicList.playBackmusic.albumimg || './img/jige.png' + ')' }">
        <div class="head">
            <div class="button">
                <div class="icon" @click="hideMusicPlay">
                    <IconClose />
                </div>
            </div>
        </div>
        <div class="body">
            <div class="context">
                <div class="intro">
                    <div class="intro-box">
                        <img :src="musicList.playBackmusic.albumimg || './img/jige.png'" alt="">
                        <div class="text-box">
                            <div class="name">{{ musicList.playBackmusic.name }}</div>
                            <div class="singer text">{{ musicList.playBackmusic.singer + '-' +
                                musicList.playBackmusic.albumName }}</div>
                        </div>
                    </div>
                </div>
                <div class="lyric" ref="lyricBox" @mouseenter="toggleScroll(false)" @mouseleave="toggleScroll(true)">
                    <el-scrollbar height="100%" ref="scrollbarRef">
                        <div class="item" v-for="(item, index) in musicLyric" :key="index"
                            :class="{ active: currentLyricIndex === index }" @click="playMusicLyric(item.time)">{{
                                item.text }}
                        </div>
                    </el-scrollbar>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { IconClose } from '@arco-design/web-vue/es/icon'
import { useMusicList } from '@/stores/musicList';
import { getMusicLyric } from '@/assets/js/ajaxMusicApi';
import scrllbarShow from '@/assets/js/scrllbarShow';

const props = defineProps(['audio']); //获取父组件音乐控件
const musicList = useMusicList();  //导入音乐储存库
const musicLyric = ref([]); // 处理好的歌词数据
const currentLyricIndex = ref(0); //高亮歌词
const lyricBox = ref(null); // 歌词盒子元素
const scrollbarRef = ref(null); // 滚动区域元素
const autoScrollEnabled = ref(true) // 是否停止滚动

// 关闭音乐信息展示
const emit = defineEmits();
const hideMusicPlay = () => {
    emit('close');
};

// 处理歌词数据
const parseLyric = (lyric) => {
    const lines = lyric.split('\n');  // 分割每一行
    const result = [];

    // 遍历每一行歌词
    lines.forEach(line => {
        const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
        if (match) {
            const minutes = parseInt(match[1], 10);
            const seconds = parseFloat(match[2]);
            const time = minutes * 60 + seconds;
            const text = match[3].trim();
            if (text) {
                result.push({ time, text });
            }
        }
    });

    return result;
};

const updateLyric = () => {
    const currentTime = props.audio.currentTime; // 获取当前播放时间

    // 找到当前时间对应的歌词索引
    const index = musicLyric.value.findIndex(lyric => currentTime < lyric.time);

    // 计算 newIndex，确保不小于 0
    const newIndex = index === -1 ? musicLyric.value.length - 1 : index - 1;

    // 索引有变化时更新并触发滚动
    if (newIndex !== currentLyricIndex.value) {
        currentLyricIndex.value = newIndex;
        scrollToCurrentLyric();
    }
};

// 进入歌词区域后停止歌单滚动
const toggleScroll = (enabled) => {
    autoScrollEnabled.value = enabled;
};

// 滚动到当前歌词
const scrollToCurrentLyric = () => {
    if (!autoScrollEnabled.value) return
    scrllbarShow(scrollbarRef, lyricBox, '.active')
};

// 点击歌词更新进度
const playMusicLyric = (time) => {
    props.audio.currentTime = time
};

// 解析歌词并保存
watch(() => musicList.playBackmusic.id, async (id) => {
    if (musicList.playBackmusic.source === 'netease') {
        const lyric = (await getMusicLyric(id)).data.lrc.lyric;
        musicLyric.value = parseLyric(lyric);
    } else {
        musicLyric.value = [{ time: 0, text: '暂无歌词' }]
    }
}, { immediate: true });

// 添加音频事件监听
onMounted(() => {
    if (musicList.playBackmusic.source != 'netease') return
    props.audio.addEventListener('timeupdate', updateLyric);
});

// 移除音频事件监听
onUnmounted(() => {
    props.audio.removeEventListener('timeupdate', updateLyric);
});
</script>

<style lang="scss">
@use '../assets/css/musicStyle.scss' as *;

#musicPlayShow {
    position: fixed;
    top: 0;
    left: 0;
    width: 100dvw;
    height: 100dvh;
    z-index: 2;
    background: no-repeat center;
    background-size: cover;

    &::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        background: #fff;
        opacity: 0.2;
        z-index: 1;
        pointer-events: none;
    }

    &::after {
        content: "";
        position: absolute;
        display: block;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: 1;
        backdrop-filter: blur(150px);
    }

    .head {
        position: relative;
        padding: 20px;
        z-index: 99;
    }

    .body {
        display: flex;
        justify-content: center;
        position: relative;
        padding: 75px 20px;
        z-index: 99;

        .context {
            display: flex;
            justify-content: center;
            width: 95%;

            .intro {
                width: 50%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: end;

                .intro-box {
                    width: 70%;
                }

                img {
                    width: 60%;
                    aspect-ratio: 1 / 1;
                }

                .name {
                    font-weight: bold;
                    font-size: 38px;
                    margin: 30px 0;
                }

                .text {
                    font-size: 16px;
                    color: rgba($color: #000000, $alpha: 0.5);
                    margin-bottom: 10px;
                }
            }

            .lyric {
                width: 45%;
                max-height: calc(100dvh - 300px);
                overflow: hidden;

                .item {
                    display: flex;
                    align-items: center;
                    height: 60px;
                    list-style: none;
                    font-size: 1.5rem;
                    margin: 15px 0;
                    transition: all 0.6s;
                    cursor: pointer;
                    border-radius: 7px;
                    padding: 5px;

                    &.active {
                        font-size: 2.2rem;
                        color: #fff;
                        text-shadow: 0px 0px 16px #333;
                    }

                    &:hover {
                        background-color: rgba($color: #000000, $alpha: 0.3)
                    }
                }
            }
        }

    }

    .icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 32px;
        height: 32px;
        border-radius: 7px;
        font-size: 24px;

        &:hover {
            background-color: rgba($color: #333, $alpha: 0.3);
        }
    }

    @include respond-to() {
        .body {
            .context {
                width: 100%;

                .intro {
                    display: none
                }

                .lyric {
                    width: 100%;
                }
            }
        }
    }
}
</style>