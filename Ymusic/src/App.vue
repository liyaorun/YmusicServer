<template>
    <el-container @contextmenu.prevent>
        <el-aside>
            <sidevar></sidevar>
        </el-aside>
        <el-main>
            <scrollbar></scrollbar>
        </el-main>
        <playback></playback>
    </el-container>
</template>

<script setup>
import sidevar from '@/components/sidebar.vue'
import scrollbar from './components/scrollbar.vue';
import playback from '@/components/playback.vue'
import { useSetting } from './stores/setting';

const setting = useSetting()
</script>

<style lang="scss">
@use './assets/css/musicStyle.scss' as *;

.el-container {
    .el-aside {
        width: 250px;
        background-color: #f2f3f5;
        border-right: 1px solid #e5e6eb;
        height: 100vh;
        overflow: hidden;
    }

    .el-main {
        position: relative;
        padding: 0;
    }

    @include respond-to() {
        .el-aside {
            width: 60px;
            overflow: hidden;
        }
    }
}
</style>