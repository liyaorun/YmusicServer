import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { wyySongSheet } from '@/stores/wyySongSheet';
import { getWyyId, getAllPlayList } from '@/assets/js/ajaxMusicApi';

// 默认启动
export let wyyMusicListStatus = ref({});

// 辅助函数：安全获取存储
function getSongSheetStore() {
    return wyySongSheet();
}

// 检测有没有网易云用户id判断是否添加
export function detectionWyyUesrId() {
    const SongSheet = getSongSheetStore();
    
    wyyMusicListStatus.value = {
        text: SongSheet.wyy.id ? '网易云歌单' : '从网易云添加歌单',
        aWMSShot: !!SongSheet.wyy.id
    };
};

// 添加歌单
export function addWyyMusicSongSheet() {
    const SongSheet = getSongSheetStore();
    
    ElMessageBox.prompt('', '输入网易云用户名(标点符号要带上)', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '不能为空',
    }).then(async ({ value }) => {
        const nickname = (await getWyyId(value)).data.nicknames[value];
        SongSheet.wyy.id = nickname;
        refreshWyyMusicSongSheet(nickname);
        detectionWyyUesrId();
    });
}

// 获取所有歌单
export async function refreshWyyMusicSongSheet(wyyNameId) {
    const SongSheet = getSongSheetStore();
    quitWyyMusicSongSheet(wyyNameId);

    const data = (await getAllPlayList(wyyNameId)).data.playlist;

    data.forEach(data => {
        SongSheet.list.push({
            songSheetId: data.id,
            imgUrl: data.coverImgUrl,
            name: data.name,
            description: data.description
        })
    });

    if (SongSheet.wyy.name) return
    const { avatarUrl: avatar, nickname: name } = data[0].creator;
    Object.assign(SongSheet.wyy, { avatar, name });
}

// 清除旧歌单信息
export function quitWyyMusicSongSheet(id, name, avatar) {
    const SongSheet = getSongSheetStore();
    Object.assign(SongSheet.wyy, { id, name, avatar });
    SongSheet.list.splice(2);
    detectionWyyUesrId();
}