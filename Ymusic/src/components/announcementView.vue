<template>
    <teleport to='body'>
        <div class="announBg"></div>
        <div id="view" ref="viewRef">
            <div class="context">
                <p>123123123123123</p>
                <p>123123123123123</p>
                <p>123123123123123</p>
                <p>123123123123123</p>
                <p>123123123123123</p>
                <p>123123123123123</p>
                <p>123123123123123</p>
            </div>
            <div class="buutonBox">
                <el-button type="success" @click="handleClose">确定</el-button>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { defineEmits } from 'vue'

// 声明 close 事件
const emit = defineEmits(['close'])

// 处理关闭事件
const handleClose = () => {
    emit('close') // 触发close事件
}
</script>

<style lang="scss" scoped>
#view {
    position: fixed;
    top: 10%;
    left: 50%;
    width: 500px;
    border: 1px solid rgba(229, 230, 235, 0.85);
    backdrop-filter: blur(6px);
    background-color: #fff;
    transform: translateX(-50%);
    padding: 10px;
    border-radius: 7px;
    z-index: 3;

    .buutonBox {
        display: flex;
        justify-content: right;

        button {
            background-color: #27AE60;
            border: 0;
        }
    }
}

.announBg {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 2;
}
</style>