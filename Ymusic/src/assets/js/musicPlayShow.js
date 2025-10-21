import { ref } from 'vue';
export default function musicPlayShowJs() {
    const showMenu = ref(false);

    const showMusicPlay = () => {
        showMenu.value = true;
    };

    const hideMusicPlay = () => {
        showMenu.value = false
    };

    return { showMenu, showMusicPlay, hideMusicPlay };
}