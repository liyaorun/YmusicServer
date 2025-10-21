import axios from 'axios';
import { ref, reactive } from 'vue'

// 搜索专辑里面的歌
let list = reactive([])
export function addMusicList(id, num, began) {
    axios.get(`/wyyApi/playlist/track/all?id=${id}&limit=${num}&offset=${began}`).then(data => {
        data.data.songs.forEach(item => {
            list.push({
                id: item.id,
                name: item.name,
                singer: item.ar.map(singer => singer.name).join('/'),
                albumName: item.al.name,
                albumimg: item.al.picUrl,
                source: 'netease'
            })
        });
    })
    return list
}

export async function getWyyId(name) {
    return await axios.get(`/wyyApi/get/userids?nicknames=${name}`);
}

export async function getAllPlayList(wyyNameId) {
    return await axios.get(`/wyyApi/user/playlist?uid=${wyyNameId}`)
}

export async function getMusicUrl(MusicId) {
    return await axios.get(`/wyyApi/match?id=${MusicId}`)
}


export async function getMusicSearch(MusicName) {
    return await axios.get(`/wyyApi/cloudsearch?keywords=${MusicName}`)
}

export async function getMusicLyric(MusicId) {
    return await axios.get(`/wyyApi/lyric?id=${MusicId}`)
}

export async function getGuoHeMusicSearch(MusicName) {
    const params = new URLSearchParams();
    params.append('keywords', MusicName)

    return await axios.post(`/ghyinyue/search`, params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',  // 设置请求头
        },
    });
}

export async function getGuoHeMusicUrl(MusicId) {
    const params = new URLSearchParams();
    params.append('secret', MusicId)

    return await axios.post(`/ghyinyue/getUrlTest`, params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
}

export async function getGdstudiotMusicSearch(MusicName) {
    return await axios.get(`/gdstudio/api.php?types=search&source=joox&name=${MusicName}`)
}


export async function getGdstudiotMusicUrl(MusicId) {
    return await axios.get(`/gdstudio/api.php?types=url&source=joox&id=${MusicId}&br=320`)
}

export async function getGdstudiotMusicPic(MusicId) {
    return await axios.get(`/gdstudio/api.php?types=pic&source=joox&id=${MusicId}&size=300`)
}