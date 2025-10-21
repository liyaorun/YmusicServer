<template>
    <el-scrollbar height="100dvh" @scroll="scroll" ref="reference">
        <div class="nav">
            <div class="announcement" title="公告" @click="() => dialogTableVisible = !dialogTableVisible">
                <IconBookmark />
            </div>
            <div class="search" @click="router.push('/search')">
                <IconSearch /><span>搜索</span>
            </div>
        </div>
        <router-view></router-view>
    </el-scrollbar>

    <el-dialog v-model="dialogTableVisible" title="公告" width="50%" id="elDialog">
        <div class="disclaimer">
            <p>免责声明：本站资源来自网络，限本人学习参考，严禁下载、传播或商用</p>
            <p>如有侵权,联系3386404605@qq.com进行删除</p>
        </div>
        <div class="link">
            <p>项目地址:<a href="https://github.com/liyaorun/Ymusic"
                    target="_blank">https://github.com/liyaorun/Ymusic</a>
            </p>
            <p>网易云api地址:<a href="https://github.com/Binaryify/NeteaseCloudMusicApi"
                    target="_blank">https://github.com/Binaryify/NeteaseCloudMusicApi</a></p>
            <p>音乐源地址:<a href="https://github.com/UnblockNeteaseMusic/server"
                    target="_blank">https://github.com/UnblockNeteaseMusic/server</a></p>
            <p>感谢GD-Studio提供的api资源</p>
        </div>
        <div class="update">
            <div>
                <b>2025.6.30</b><br>
                <b>1.2.1更新:</b>
                <p>添加搜索页面下joox(腾讯)源</p>
                <p>删除开发环境遗留垃圾</p>
            </div>
            <div>
                <b>2025.6.6</b><br>
                <b>1.2.0更新:</b>
                <p>更新头像登录功能</p>
                <p>优化公告栏样式</p>
                <p>优化正在播放列表样式</p>
                <p>优化首页底部网易云歌单添加样式</p>
                <p>移除搜索页面下果核源(已失效)</p>
            </div>
        </div>
        <span class="version" style="position: absolute;right: 10px;bottom: 10px;">版本:1.2.1</span>
    </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import debounce from '@/assets/js/debounce';
import { useMusicList } from '@/stores/musicList';
import { addMusicList } from '@/assets/js/ajaxMusicApi'
import { IconBookmark, IconSearch } from '@arco-design/web-vue/es/icon';

const route = useRoute(); // 获取路由信息
const router = useRouter(); // 获取路由信息
const musicList = useMusicList() // 导入音乐链接存储
const reference = ref(null); // 滚动组件本体
let id = ref(null) // 歌单id
let scrollNum = ref(null)
let dialogTableVisible = ref(false)
let opacityNum = 0

// 检测音乐id变化，更新id
watch(() => route.query.id, (newPath) => id = newPath);

let musicListListLength = null
const debounceFun = debounce(function () {
    if (musicListListLength == musicList.list.length) return
    addMusicList(id, 500, musicList.list.length)
    musicListListLength = musicList.list.length
}, 300)

/**
 * 下拉添加更多内容
 * 应该是到底部才开始添加内容
 * 可能是模板html结构部分被我写成答辩了，一直没办法从底部开始添加
 * 只能这样子处理
 */
const scroll = ({ scrollTop }) => {
    scrollNum.value = scrollTop// 获取歌曲列表的 DOM 元素
    const songSheet = reference.value.$el.querySelector('#songSheet');
    // 判断是否存在歌曲列表以及滚动位置是否过半
    if (songSheet && scrollTop >= songSheet.clientHeight / 2) debounceFun()
    scrollTop / 200 > 0.85 ? opacityNum = 0.85 : opacityNum = scrollTop / 200
    document.querySelector('.nav').style.setProperty('--opacity', opacityNum)
};
</script>

<style lang="scss" scoped>
.el-scrollbar {
    position: relative;

    .nav {
        --opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-between;
        padding: 10px 50px;
        backdrop-filter: blur(6px);
        border-color: rgba(255, 255, 255, var(--opacity, 0.85));
        background-color: rgba(255, 255, 255, var(--opacity, 0.85));
        z-index: 2;


        .announcement {
            padding: 10px;
            border-radius: 7px;
            font-size: 18px;
            cursor: pointer;

            &:hover {
                background-color: #ccc;
            }
        }

        .search {
            position: relative;
            display: flex;
            justify-content: left;
            align-items: center;
            width: 200px;
            height: 36px;
            padding: 0 16px;
            font-size: 14px;
            border-radius: 15px;
            background-color: rgba(39, 46, 59, .08);
            color: inherit;
            opacity: .8;
            z-index: 3;
            cursor: pointer;

            span {
                margin-left: 5px;
            }
        }

        .search:hover {
            background-color: rgba(39, 46, 59, .18)
        }
    }
}

#elDialog{
    position: relative;

    p{
        margin: 0;
        margin-bottom: 10px;
    }

    div{
        margin-bottom: 10px;
        font-size: 15px;
    }

    a:hover{
        border-bottom: 1px solid #000;
    }

    .disclaimer{
        border-bottom: 1px solid #ccc;
    }

    .link{
        border-bottom: 1px solid #ccc;
    }

    .update{
        div{
            margin-bottom: 10px;

            p{
                margin: 0;
            }
        }
    }
}
</style>