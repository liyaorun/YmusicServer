<template>
    <div id="message">
        <div class="context" ref="contextRef">
            <div class="item" v-for="(item, index) in messageData" :key="item.id" :style="item.style"
                @animationend="handleAnimationEnd(item.id)">
                {{ item.text }}
            </div>
        </div>
        <div class="input">
            <div class="box-input">
                <input type="text" placeholder="留言" v-model="MessageValue">
                <button @click="addMessageFun">
                    <IconArrowUp style="color: #fff; font-size: 22px;" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { IconArrowUp } from '@arco-design/web-vue/es/icon'
import { ElMessage } from 'element-plus'
import { wyySongSheet } from '@/stores/wyySongSheet';
import addKeydown from '@/assets/js/addKeydown';

const messageData = ref([])
const contextRef = ref(null)
const MessageValue = ref(null)
const messageQueue = ref([])
const SongSheet = wyySongSheet()

// 获取消息数据
const getMessageData = async () => {
    const response = (await axios.get('/server/api/getcontext')).data.data;
    const count = Math.min(response.length, 50); // 取前50个或所有元素
    messageData.value = response.slice(0, count).map(item => ({
        ...item,
        style: generateItemStyle()
    }));
    messageQueue.value = response.slice(count); // 取剩余的元素
}

// 生成样式
const generateItemStyle = () => ({
    top: `${Math.random() * 60 + 10}%`,
    animationDelay: `${Math.random() * 8}s`,
    animationDuration: `${Math.random() * 10 + 15}s`
})

// 处理动画结束
const handleAnimationEnd = (id) => {
    const index = messageData.value.findIndex(item => item.id === id)
    messageQueue.value.push(messageData.value[index])
    messageData.value.splice(index, 1)

    setTimeout(() => {
        addItem()
    }, 200)
}

const addItem = () => {
    const newItem = messageQueue.value.shift() // 从 queue 中移除第一个元素
    newItem.style = generateItemStyle() // 赋予新样式
    messageData.value.push(newItem) // 添加到 messageData
}

const addMessageFun = () => {
    let name = SongSheet.wyy.name || '未知'
    let text = MessageValue.value
    if (!MessageValue.value) return ElMessage.error({
        message: '留言内容为空',
        grouping: true,
    });

    axios.post(`/server/api/addcontext?user=${name}&context=${text}`)
        .then(response => {
            ElMessage.success('留言成功')
            MessageValue.value = null

            const newMessageData = {
                user: name,
                text: text
            }

            newMessageData.style = generateItemStyle()

            messageData.value.push(newMessageData)
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// 添加键盘事件
addKeydown((event) => {
    if (event.code === 'Enter') {
        event.preventDefault();
        addMessageFun()
    }
})

getMessageData()
</script>

<style lang="scss">
@use '../assets/css/musicStyle.scss' as *;

#message {
    position: relative;
    width: 100%;
    padding-top: 60px;

    .context {
        width: 100%;
        height: calc(100dvh - 100px);
        position: relative;
    }

    .item {
        position: absolute;
        right: 0;
        padding: 10px;
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        color: #000;
        font-size: 16px;
        max-width: 90%;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        white-space: nowrap;
        transform: translateX(100%);

        animation-name: slide-left;
        animation-timing-function: linear;
    }

    @keyframes slide-left {
        0% {
            right: 0;
        }

        100% {
            right: 110%;
        }
    }

    .input {
        @include flexJustify(center);
        position: absolute;
        bottom: 70px;
        left: 0;
        right: 0;
        padding: 10px;

        .box-input {
            position: relative;
            width: 40%;

            input {
                width: 100%;
                height: 50px;
                border-radius: 30px;
                border: 0;
                outline: 0;
                background-color: rgba(39, 46, 59, 0.18);
                color: #000;
                font-size: 18px;
                padding: 0 25px;
                box-sizing: border-box;

                &:focus {
                    background-color: rgba(39, 46, 59, 0.28);
                }
            }

            button {
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                border: 0;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background-color: #27AE60;
                outline: 0;
                cursor: pointer;

                &:active {
                    background-color: #1e874a;
                }
            }
        }
    }

    @include respond-to() {
        .input {
            .box-input {
                width: 75%;
            }
        }
    }
}
</style>