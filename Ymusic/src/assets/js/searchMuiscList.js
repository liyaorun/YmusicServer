import { getMusicSearch, getGuoHeMusicSearch,getGdstudiotMusicSearch,getGdstudiotMusicPic } from '@/assets/js/ajaxMusicApi';
import { wyySongSheet } from '@/stores/wyySongSheet';

const SongSheet = wyySongSheet()

export async function searchMuiscList(source, searchValue) {
    let music = []
    if (source == 'netease') {
        ((await getMusicSearch(searchValue)).data.result.songs).forEach(item => {
            music.push({
                id: item.id,
                name: item.name,
                singer: item.ar.map(singer => singer.name).join('/'),
                albumName: item.al.name,
                albumimg: item.al.picUrl,
                source: source
            })
        });
    }

    if (source == 'guohe') {
        ((await getGuoHeMusicSearch(searchValue)).data.data).forEach(item => {
            music.push({
                id: item.id,
                name: item.name,
                singer: item.author,
                albumName: item.album || '未知',
                albumimg: item.pic.startsWith('/assets/index/img/cp.png') ? './img/falseImg.png' : item.pic,
                source: source
            })
        })
    }

    if(source == 'joox'){
        ((await getGdstudiotMusicSearch(searchValue)).data).forEach(item => {
            music.push({
                id: item.id,
                name: item.name,
                singer: item.artist[0],
                albumName: item.album || '未知',
                albumimg: './img/falseImg.png',
                source: source
            })
        })
    }

    SongSheet.musicLoadding = false;
    return music
}