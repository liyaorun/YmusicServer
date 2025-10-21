import { nextTick } from 'vue';
import anime from 'animejs/lib/anime.es.js';

export default function scrllbarShow(scrollbar, main, className, durationValue = 350) {
    nextTick(() => {
        if (!main.value.querySelector(className)) return

        anime({
            targets: scrollbar.value.wrapRef,
            scrollTop: main.value.querySelector(className).offsetTop - scrollbar.value.wrapRef.offsetHeight / 2 + main.value.querySelector(className).offsetHeight / 2,
            duration: durationValue, // 设置滚动时间
            easing: 'linear' // 选择缓动效果
        });
    });
}