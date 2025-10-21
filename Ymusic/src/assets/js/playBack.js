import { getMusicUrl } from "./ajaxMusicApi"

export async function playMusicUrl(id) {
    audio.src = (await getMusicUrl(id)).data.url
    audio.play()
}


