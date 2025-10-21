import { ref, onMounted, onUnmounted } from 'vue';

export default function usetouchMenu() {
    const showMenu = ref(false);
    const musicItem = ref('')

    const showContextMenu = (item) => {
        showMenu.value = true;
        musicItem.value = item
    };

    const hideContextMenu = (e) => {
        // 如果点击的元素在 touchMenu 内，则不隐藏
        if (e.target.closest('.touchMenu')) return;
        showMenu.value = false;
    };

    onMounted(() => {
        window.addEventListener('click', hideContextMenu, true);
    });

    onUnmounted(() => {
        window.removeEventListener('click', hideContextMenu);
    });

    return { showMenu, musicItem, showContextMenu };
}