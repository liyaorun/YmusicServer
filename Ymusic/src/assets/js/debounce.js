export default function debounce(callback, delay) {
    let timer = null;
    return function (...args) { // 使用 ...args 接收所有传入参数
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback.apply(this, args); // 将参数传递给 callback
        }, delay);
    };
}