import { ref } from 'vue';
export default function musicPlayShowJs() {
    const drawerShow = ref(false);

    const showDrawerShow = () => {
        drawerShow.value = !drawerShow.value;
    };

    const hideDrawerShow = () => {
        drawerShow.value = false
    };

    return { drawerShow, showDrawerShow, hideDrawerShow };
}