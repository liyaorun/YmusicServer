import { ref, onMounted, onUnmounted } from 'vue';

export default function useContextMenu() {
    const showMenu = ref(false);
    const x = ref(0);
    const y = ref(0);

    const showContextMenu = (event) => {
        showMenu.value = true;
        x.value = event.clientX;
        y.value = event.clientY;
    };

    const hideContextMenu = () => showMenu.value = false;

    onMounted(() => {
        window.addEventListener('click', hideContextMenu);
        window.addEventListener('contextmenu', hideContextMenu, true);
        window.addEventListener('wheel', hideContextMenu);
    });

    onUnmounted(() => {
        window.removeEventListener('click', hideContextMenu);
        window.removeEventListener('contextmenu', hideContextMenu);
        window.removeEventListener('wheel', hideContextMenu);
    });

    return { showMenu, x, y, showContextMenu };
}