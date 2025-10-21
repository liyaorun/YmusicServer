<template>
    <div id="playback" :class="{ 'playMusicShow': showMenu }">
        <el-slider v-model="musicSlider" :min="0" :max="musicDuration" :show-tooltip="false"
            :format-tooltip="formatTime" @change="onSliderChange" @input="onSliderInput" :disabled="!audioLoaded" />
        <div class="musicContent el-col-8">
            <div class="musicContent-body" v-if="!showMenu">
                <div class="img" @click="showMusicPlay">
                    <img :src="musicList.playBackmusic.albumimg || './img/jige.png'" alt="Album Image" />
                    <div class="IconExpand">
                        <IconExpand />
                    </div>
                </div>
                <div class="text">
                    <div class="title">{{ musicList.playBackmusic.name || '未播放' }}</div>
                    <div class="singer">{{ musicList.playBackmusic.singer || '未知歌手' }}</div>
                </div>
            </div>
        </div>
        <div class="musicControl el-col-8">
            <div class="Up iconButton" @click="NewPlay(-1)">
                <icon-skip-previous-fill class="icon" />
            </div>
            <div class="stop iconButton" @click="playPause">
                <icon-pause v-if="playPauseShow" :style="{ fontSize: '48px' }" class="icon" />
                <IconPlayArrowFill v-else :style="{ fontSize: '48px' }" class="icon" />
            </div>
            <div class="Under iconButton" @click="NewPlay(1)">
                <icon-skip-next-fill class="icon" />
            </div>
        </div>
        <div class="musicFeature el-col-8">
            <div class="time-display">
                {{ currentTimeFormatted }} / {{ durationFormatted }}
            </div>
            <div class="musicState icon iconButton" @click="musicStateClick">
                <img :src=musicStateValue alt="">
            </div>
            <div class="voice">
                <div class="icon iconButton" @click="onVolumeChange(IconSoundNum = IconSoundNum === 0 ? 100 : 0);">
                    <IconSound v-if="IconSoundNum" />
                    <IconMute v-else />
                </div>
                <div class="bg">
                    <el-slider v-model="IconSoundNum" vertical height="100px" :show-tooltip="false"
                        @input="onVolumeChange(IconSoundNum)" />
                </div>
            </div>
            <div class="playMusicList iconButton icon" @click.stop="showDrawerShow">
                <icon-menu-unfold class="unfoldIcon" />
            </div>
        </div>
    </div>

    <transition name="fadePlay">
        <musicPlayShow v-if="showMenu" :audio="audio" @close="hideMusicPlay"></musicPlayShow>
    </transition>

    <transition name="fade">
        <drawerPlayList v-if="drawerShow" @click.stop :class="{ 'drawerMusicShow': showMenu }">
        </drawerPlayList>
    </transition>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { useMusicList } from '@/stores/musicList';
import { giveMusicUrl } from '@/assets/js/giveMusicUrl';
import debounce from '@/assets/js/debounce';
import musicPlayShowJs from '@/assets/js/musicPlayShow';
import drawerPlayList from '@/components/drawerPlayList.vue';
import musicPlayShow from '@/components/musicPlayShow.vue';
import drawerPlayListShow from '@/assets/js/drawerPlayListShow'
import addKeydown from '@/assets/js/addKeydown';
import { ElMessage } from 'element-plus'
import { IconPause, IconSkipNextFill, IconSkipPreviousFill, IconExpand, IconMenuUnfold, IconPlayArrowFill, IconSound, IconMute } from '@arco-design/web-vue/es/icon';

const musicList = useMusicList();// 引入状态管理
const musicSlider = ref(0); // 当前播放进度
const musicDuration = ref(0); // 音乐总时长
const playPauseShow = ref(false); // 控制播放/暂停图标显示
const currentTime = ref(0); // 当前播放时间
const IconSoundNum = ref(100); // 初始音量
const audio = new Audio(); // 播放本体
const audioLoaded = ref(false); // 音频是否加载完成
const onSliderInputNum = ref(null) // 答辩拖动进度条值
const { showMenu, showMusicPlay, hideMusicPlay } = musicPlayShowJs() // 控制音乐信息展示
const { drawerShow, showDrawerShow, hideDrawerShow } = drawerPlayListShow() // 控制音乐列表抽屉展示

// 格式化时间
const formatTime = (time) => `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, '0')}`;

// 显示格式化后的时间
const currentTimeFormatted = computed(() => formatTime(currentTime.value));
const durationFormatted = computed(() => formatTime(musicDuration.value));

// 当音频加载元数据时，更新总时长并标记为加载完成
const onLoadedMetadata = () => {
    musicDuration.value = audio.duration;
    audioLoaded.value = true;
};

// 将滑块值转换音量
const onVolumeChange = (value) => audio.volume = value / 100;

// 播放或暂停音乐
const playPause = () => {
    const { id } = musicList.playBackmusic;

    // 如果没有播放列表ID，直接返回
    if (!id) return;

    // 如果没有音频源则播放音乐
    !audio.src && playBackMusic(id);

    // 切换播放/暂停状态，并根据状态播放或暂停音频
    playPauseShow.value = !playPauseShow.value;
    playPauseShow.value ? audio.play() : audio.pause();
};

// 初始化防抖后的播放音乐函数
const playBackMusicDebounced = debounce(async (id) => {
    const musicData = await giveMusicUrl(id, musicList.playBackmusic.source);

    if (musicData) {
        audio.src = musicData;
        audioLoaded.value = false;
        await audio.play();
        playPauseShow.value = true;
    }
}, 500)

// 加载并播放音乐，并传递参数 id
const playBackMusic = (id) => playBackMusicDebounced(id);


// 三种音乐播放模式
const musicStates = [
    { id: 'loop', icon: '/public/svg/loop.svg', text: '列表循环' },
    { id: 'repeat', icon: '/public/svg/repeat-one.svg', text: '单曲循环' },
    { id: 'shuffle', icon: '/public/svg/shuffle.svg', text: '随机播放' }
];

// 默认列表循环模式
const musicStateValue = ref(musicStates[0].icon);

const musicStateClick = () => {
    // 查找当前音乐播放模式索引号
    const currentIndex = musicStates.findIndex(state => state.icon === musicStateValue.value);
    // 循环切换音乐播放模式
    const nextIndex = (currentIndex + 1) % musicStates.length;
    // 信息提示当前播放模式
    ElMessage({ message: musicStates[nextIndex].text });
    // 替换当前播放模式图标
    musicStateValue.value = musicStates[nextIndex].icon;
};

// 切换歌曲（上一首或下一首）
// 切换歌曲（上一首或下一首）
const NewPlay = (offset) => {
    // 获取当前播放模式
    let newIndex;
    let statesId = musicStates.find(item => item.icon === musicStateValue.value).id;

    if (statesId == 'loop' || statesId == 'repeat') {
        newIndex = musicList.playList.findIndex((item) => item.id === musicList.playBackmusic.id) + offset;

        // 循环播放：如果超过范围则回到开头或结尾
        if (newIndex < 0) {
            newIndex = musicList.playList.length - 1;
        } else if (newIndex >= musicList.playList.length) {
            newIndex = 0;
        }

    }

    if (statesId === 'shuffle') {
        // 随机播放：随机选择一个索引
        newIndex = Math.floor(Math.random() * musicList.playList.length);

        // 确保不会重复播放同一首歌（可选）
        let currentIndex = musicList.playList.findIndex((item) => item.id === musicList.playBackmusic.id);
        while (newIndex === currentIndex && musicList.playList.length > 1) {
            newIndex = Math.floor(Math.random() * musicList.playList.length);
        }
    }

    // 更新播放数据
    if (newIndex !== undefined && musicList.playList[newIndex]) {
        musicList.playBackmusic = musicList.playList[newIndex];
    }
};

// 更新播放进度
const updateProgress = () => {
    currentTime.value = audio.currentTime;
    musicSlider.value = audio.currentTime;
};

// 获取音乐进度条拖动的值
const onSliderInput = (value) => onSliderInputNum.value = value

// 监听滑块变化，更新音频播放时间
const onSliderChange = (value) => {
    // 确保音频已经加载好，并且有音乐资源
    if (!audioLoaded.value || !audio.src || musicDuration.value === 0) return;

    // 更新当前播放时间
    audio.currentTime = onSliderInputNum.value;
};

// 播放完毕后自动播放下一首
const onEnded = () => {
    const song = { ...musicList.playBackmusic };
    const statesId = musicStates.find(item => item.icon === musicStateValue.value).id;

    // 移除已存在的歌曲 ，并添加到最前面
    musicList.history = [song, ...musicList.history.filter(item => item.id !== song.id)];

    // 保持数组长度不超过 100
    if (musicList.history.length > 100) musicList.history.pop();

    if (statesId === 'repeat') {
        // 单曲循环模式：重新播放当前歌曲
        audio.currentTime = 0;
        audio.play().catch(error => {
            console.error("Playback failed:", error);
        });
    } else {
        // 其他模式：播放下一首
        NewPlay(1);
    }
};

// 监听歌曲id加载并播放新歌曲
watch(() => musicList.playBackmusic.id, (id) => {
    audio.src = id ? playBackMusic(id) : '';
    playPauseShow.value = !!id;
    audioLoaded.value = false; // 当歌曲切换时，重新设置加载状态
});

// 空格键盘事件
addKeydown((event) => {
    if (event.code === 'Space') {
        event.preventDefault();
        playPause();
    }
}, true);

// 添加音频事件监听
onMounted(() => {
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    window.addEventListener('click', hideDrawerShow);
    window.addEventListener('contextmenu', hideDrawerShow);
});

// 移除音频事件监听
onUnmounted(() => {
    audio.removeEventListener('timeupdate', updateProgress);
    audio.removeEventListener('loadedmetadata', onLoadedMetadata);
    audio.removeEventListener('ended', onEnded);
    window.removeEventListener('click', hideDrawerShow);
    window.removeEventListener('contextmenu', hideDrawerShow);
});
</script>


<style lang="scss" scoped>
@use '../assets/css/musicStyle.scss' as *;

#playback {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100px;
    background-color: #fff;
    padding: 0 20px;
    user-select: none;
    transition: all 0.6s;
    z-index: 3;

    .el-col-8 {
        display: flex;
        justify-content: center;
        align-items: center;

        .iconButton {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 48px;
            height: 48px;
            border-radius: 7px;
            cursor: pointer;

            &:hover {
                background-color: rgb(242, 243, 245);
            }
        }
    }

    .musicContent {
        display: flex;
        justify-content: left;

        .musicContent-body {
            display: flex;
        }

        .img {
            position: relative;
            width: 64px;
            height: 64px;
            margin-right: 15px;
            cursor: pointer;

            img {
                width: 100%;
                height: 100%;
            }

            .IconExpand {
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                font-size: 64px;
                color: #fff;
                background-color: rgba($color: #333, $alpha: 0.5);
                transition: all 0.3s;
                opacity: 0;
            }

            &:hover .IconExpand {
                opacity: 1;
            }
        }

        .text {
            display: flex;
            flex-direction: column;
            justify-content: center;

            .title {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 5px;
            }
        }
    }

    .musicControl {
        .stop {
            margin: 0 25px;
        }

        .icon {
            font-size: 36px;
        }
    }

    .musicFeature {
        justify-content: right;


        .playMusicList {
            width: 24px;
            height: 24px;

            .unfoldIcon {
                font-size: 26px;
            }
        }

        .time-display {
            margin: 0 10px;
        }

        .musicState {}

        .voice {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;

            &:hover {
                height: 100px;

                .bg {
                    display: block;
                }
            }

            :deep(.el-slider) {
                position: absolute;
                top: 5px;
                left: 50%;
                transform: translateX(-50%);
            }

            .bg {
                display: none;
                position: absolute;
                top: -100px;
                width: 30px;
                height: 120px;
                border-radius: 5px;
                padding: 5px;
                background-color: rgba(39, 46, 59, 0.18);
                z-index: 2;
            }
        }

        .icon {
            position: relative;
            display: flex;
            justify-content: center;
            font-size: 22px;
            width: 35px;
            height: 35px;
            z-index: 2;
            margin: 0 5px;
            cursor: pointer;
        }
    }

    .el-slider {
        transition: all 0.5s;
        position: absolute;
        top: -16px;

        :deep(.el-slider__bar) {
            background-color: #16b777;
        }

        :deep(.el-slider__button) {
            border-color: #16b777;
        }
    }

    @include respond-to() {
        .musicContent {
            .text {
                display: none;
            }
        }

        .musicFeature {
            .time-display {
                display: none;
            }

            .voice {
                display: none;
            }
        }
    }
}

.playMusicShow {
    background-color: transparent !important;
    border: 0 !important;

    &:hover {
        :deep(.el-slider) {
            transform: translateY(0);
        }
    }

    :deep(.el-slider) {
        transform: translateY(96px);

        .el-slider__bar {
            background-color: rgba($color: #000, $alpha: 0.15) !important;
        }

        .el-slider__runway {
            background-color: rgba($color: #a1a1a1, $alpha: 0.03);
        }

        .el-slider__button {
            opacity: 0;
            background-color: #fff !important;
            border-color: rgba($color: #333, $alpha: 0.38) !important;
        }

        &:hover {
            .el-slider__bar {
                background-color: rgba($color: #000, $alpha: 0.3) !important;
            }

            .el-slider__runway {
                background-color: rgba($color: #a1a1a1, $alpha: 0.3);
            }

            .el-slider__button {
                opacity: 1;
            }
        }
    }
}

.drawerMusicShow {
    background: rgba($color: #000, $alpha: 0.3) !important;
    border: none !important;
    border-radius: 7px;
    color: #fff;
}
</style>
