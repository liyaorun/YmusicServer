<template>
    <div id="sidevar">
        <div class="user" @click="loginFun">
            <div class="img"><img :src="SongSheet.wyy.avatar || './img/jige.png'" alt=""></div>
            <div class="name">{{ SongSheet.wyy.name || '未登录' }}</div>
        </div>
        <el-menu :default-active="SongSheet.menu" :collapse="isCollapse" class="el-menu-vertical-demo"
            :default-openeds="['1']" @select="handleMenuSelect">
            <el-menu-item index="/home"><el-icon>
                    <HomeFilled />
                </el-icon><span>首页</span></el-menu-item>
            <el-menu-item index="/message"><el-icon>
                    <MessageBox />
                </el-icon><span>留言板</span></el-menu-item>
            <el-sub-menu index="1" style="color: black; background-color: #f2f3f5;">
                <template #title style="font-size: 16px;"><el-icon>
                        <Menu />
                    </el-icon><span>网易云歌单</span></template>
                <el-scrollbar class="scrollbar" height="70dvh">
                    <el-menu-item v-for="(item, index) in SongSheet.list.slice(2)"
                        :index="'/songSheet?id=' + item.songSheetId">
                        {{ item.name }}
                    </el-menu-item>
                </el-scrollbar>
            </el-sub-menu>
        </el-menu>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { wyySongSheet } from '@/stores/wyySongSheet';
import { useMusicList } from '@/stores/musicList';
import { addMusicList } from '@/assets/js/ajaxMusicApi'
import { addWyyMusicSongSheet } from '@/assets/js/addWyyMusic';

// 获取存储网易云信息
const SongSheet = wyySongSheet()
// 获取存储音乐列表地址
const musicList = useMusicList()

// 控制菜单缩放
const isCollapse = ref(window.innerWidth <= 480)

const checkWidth = () => {
    isCollapse.value = window.innerWidth <= 480;
};

// 点击头像调用获取网易云歌单函数
const loginFun = () => {
    if (!SongSheet.wyy.id) {
        addWyyMusicSongSheet()
    }
}

window.addEventListener('resize', checkWidth);

// 获取歌单里面的歌
const route = useRoute();
const router = useRouter();

watch(() => route.fullPath, (newPath) => {
    let id = route.query.id // 获取歌单id
    SongSheet.menu = newPath // 根据地址选中侧边栏
    SongSheet.musicLoadding = true // 加载显示
    musicList.list.length = 0 // 清空歌单里面的歌

    // 判断是否初始添加
    if (id && !isNaN(id)) {
        musicList.list = addMusicList(id, 500, 0)//初始添加500首歌
        setTimeout(() => SongSheet.musicLoadding = false, 700) // 关闭加载动画
    }
});

const handleMenuSelect = (index) => {
    router.replace(index)
}
</script>

<style lang="scss" scoped>
@use '../assets/css/musicStyle.scss' as *;

#sidevar {
    width: 100%;
    overflow: hidden;
    user-select: none;

    .user {
        margin: 20px 10px;
        display: flex;
        align-items: center;
        font-size: 30px;
        font-weight: bold;

        .img {
            margin-right: 20px;

            img {
                width: 60px;
                height: 60px;
                border-radius: 50%;
            }
        }

        .name {
            font-size: 16px;
        }
    }

    .el-menu {
        padding: 10px;
        background-color: #f2f3f5;
        border: 0;

        .el-menu-item {
            height: 40px;
            margin-bottom: 10px;
            border-radius: 7px;
            font-size: 16px;
            padding: 0 10px;

            & [class^=el-icon] {
                display: flex;
                justify-content: left;
            }
        }

        .el-sub-menu {
            .el-menu-item {
                display: block;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                font-size: 14px;
                line-height: 40px; // 答辩行高，不能用flex
            }

            :deep(.el-sub-menu__title) {
                padding: 0 10px;
                font-size: 16px;
            }

            :deep(.el-menu--inline) {
                background-color: #f2f3f5 !important;

                .el-scrollbar {
                    .el-scrollbar__bar {
                        display: none;
                    }
                }
            }
        }

        .is-active {
            background-color: #27AE60;
            border-radius: 7px;
            color: #fff;
        }
    }

    @include respond-to() {
        & {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .user {
            .img {
                width: 50px;
                height: 50px;
                margin: 0;

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .name {
                display: none;
            }
        }

        .el-menu {
            .el-menu-item .el-icon {
                justify-content: center;
            }
        }
    }
}
</style>