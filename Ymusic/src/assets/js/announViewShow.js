import { ref } from 'vue'

export function announViewShow() {
    const announViewShowValue = ref(false)

    const ShowTrue = () => {
        announViewShowValue.value = true
    }

    const ShowFalse = () => {
        announViewShowValue.value = false
    }

    return {
        announViewShowValue,
        ShowTrue,
        ShowFalse
    }
}