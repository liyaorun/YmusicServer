<template>
    <div id="songSheet">
        <div class="imgbg"><img :src="albumValue.imgUrl" alt=""></div>
        <div class="album">
            <div class="img"><img :src="albumValue.imgUrl" alt=""></div>
            <div class="text">
                <div class="name">{{ albumValue.name }}</div>
                <div v-if="albumValue.description" class="description">{{ albumValue.description || '暂无简介' }}</div>
            </div>
        </div>
        <musicListShow :list="musicListShowValue"></musicListShow>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useMusicList } from '@/stores/musicList';
import { wyySongSheet } from '@/stores/wyySongSheet';
import { useRoute } from 'vue-router';
import musicListShow from '@/components/musicListShow.vue';

const route = useRoute();
const musicList = useMusicList()
const SongSheet = wyySongSheet()
let albumValue = ref(null);
let musicListShowValue = null


// 获取专辑数据,页面刷新后更新数据
watch(() => route.fullPath, () => {
    albumValue.value = SongSheet.list.find(item => item.songSheetId == route.query.id);
    musicListShowValue = musicList[route.query.id] || musicList.list;
    if (musicList[route.query.id]) {
        setTimeout(() => SongSheet.musicLoadding = false, 700) // 关闭加载动画
    }
}, { immediate: true });
</script>

<style lang="scss" scoped>
@use '../assets/css/musicStyle.scss' as *;

#songSheet {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    .imgbg {
        position: absolute;
        top: 0;
        width: 100%;
        height: 470px;
        overflow: hidden;
        z-index: -1;

        img {
            width: 100%;
            filter: blur(24px);
        }
    }

    .imgbg:after {
        background: linear-gradient(0deg, #fff 0, hsla(0, 0%, 100%, .996) 8.1%, hsla(0, 0%, 100%, .983) 15.5%, hsla(0, 0%, 100%, .964) 22.5%, hsla(0, 0%, 100%, .939) 29%, hsla(0, 0%, 100%, .909) 35.3%, hsla(0, 0%, 100%, .877) 41.2%, hsla(0, 0%, 100%, .842) 47.1%, hsla(0, 0%, 100%, .808) 52.9%, hsla(0, 0%, 100%, .773) 58.8%, hsla(0, 0%, 100%, .741) 64.7%, hsla(0, 0%, 100%, .711) 71%, hsla(0, 0%, 100%, .686) 77.5%, hsla(0, 0%, 100%, .667) 84.5%, hsla(0, 0%, 100%, .654) 91.9%, hsla(0, 0%, 100%, .65));
        content: "";
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
    }

    .album {
        margin-top: 60px;
        display: flex;
        justify-content: left;
        align-items: center;
        width: 85%;

        .img {
            width: 200px;
            height: 200px;
            font-size: 0;

            img {
                height: 100%;
            }
        }

        .text {
            margin-left: 20px;

            .name {
                font-size: 40px;
            }

            .description {
                @include textLineNum(4);
                width: 80%;
                margin-top: 10px;
                font-size: 15px;
            }

            .btn {
                @include flexJustify(center);
                border: 0;
                width: 170px;
                height: 32px;
                border-radius: 15px;
                background-color: #165dff;
                margin-top: 10px;

                button {
                    border: 0;
                    background-color: transparent;
                    height: 100%;
                    color: #fff;
                    font-weight: bold;
                }

                .btn-all {
                    width: 70%;
                }

                .btn-aad {
                    width: 30%;
                }
            }
        }
    }

    .musicList {
        width: 85%;
        margin-top: 25px;
        font-size: 14px;

        .musicMessage {
            justify-content: left;
            color: #86909c;
        }

        .musicSong {
            margin-top: 15px;

            .el-row {
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
            }

            .el-row:hover {
                background-color: #dddddd;
            }
        }
    }

    @include respond-to() {
        .album {
            flex-direction: column;

            .text {
                margin: 20px 0;

                .name {
                    text-align: center;
                    font-size: 16px
                }

                .description {
                    display: none;
                }
            }
        }
    }
}
</style>