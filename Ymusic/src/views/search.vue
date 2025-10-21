<template>
    <div id="search">
        <div class="search-box">
            <div class="search-box-input">
                <div class="searchInput">
                    <el-input v-model="searchValue" size="large" placeholder="搜索歌名" class="input" />
                    <button class="play-search" @click="playSearch">
                        <el-icon :size="20">
                            <Search />
                        </el-icon>
                    </button>
                </div>
                <div class="radio">
                    <el-radio-group v-model="source">
                        <el-radio value="netease" size="large">网易</el-radio>
                        <el-radio value="joox" size="large">joox(腾讯)</el-radio>
                        <!-- <el-radio value="guohe" size="large">果核</el-radio> -->
                    </el-radio-group>
                </div>
            </div>
        </div>
        <div class="musicList">
            <musicListShow :list="musicListShowValue"></musicListShow>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import musicListShow from '@/components/musicListShow.vue';
import { ElMessage } from 'element-plus'
import { wyySongSheet } from '@/stores/wyySongSheet';
import { searchMuiscList } from '@/assets/js/searchMuiscList';
import addKeydown from '@/assets/js/addKeydown';

let source = ref('netease')
let searchValue = ref('')
let musicListShowValue = ref(null)
const SongSheet = wyySongSheet()
SongSheet.musicLoadding = false;

const playSearch = async () => {
    if (!searchValue.value) return ElMessage.error({
        message: '搜索内容为空',
        grouping: true,
    });

    SongSheet.musicLoadding = true;

    musicListShowValue.value = await searchMuiscList(source.value, searchValue.value)
};

// 空格键盘事件
addKeydown((event) => {
    if (event.code === 'Enter') {
        event.preventDefault();
        playSearch();
    }
});
</script>

<style lang="scss" scoped>
@use '../assets/css/musicStyle.scss' as *;

#search {

    .search-box {
        @include flexCenter;
        margin-top: 80px;
        width: 100%;

        .search-box-input {
            display: flex;
            width: 638px;
            flex-direction: column;

            .radio {
                width: 100%;
                @include flexJustify(left);
            }

            .searchInput {
                position: relative;
            }

            .play-search {
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
                border: none;
                background: none;
                padding: 0;
                width: 50px;
                height: 50px;
                cursor: pointer;

                .el-icon {
                    padding: 8px;
                    border-radius: 7px;
                }

                &:hover .el-icon {
                    background-color: #ccc;
                }
            }
        }

        .el-input {
            width: 638px;
            height: 50px;
        }
    }

    .musicList {
        @include flexJustify(center);
        width: 100%;
        margin-top: 20px;
    }

    @include respond-to() {
        .search-box {
            .search-box-input {
                width: 80%;

                .input {
                    width: 100%;
                }
            }
        }
    }
}
</style>