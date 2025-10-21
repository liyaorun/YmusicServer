import { onMounted, onUnmounted } from 'vue';

export default function addKeydown(funName, input = false) {
    const onKeyPress = (event) => {
        const isInput = event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA';

        if (input) {
            if (!isInput) {
                funName(event);
            }
        } else {
            funName(event);
        }
    };

    onMounted(() => {
        window.addEventListener('keydown', onKeyPress);
    });

    onUnmounted(() => {
        window.removeEventListener('keydown', onKeyPress);
    });
}