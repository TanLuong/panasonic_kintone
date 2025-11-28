import Swal from "sweetalert2";


import { getRecords } from "../../../common/tools";
import { getFormattedDate } from "../../../common/tools";


declare const kintone: any;
declare const RESERVATION_APP_ID: number;

const indexShow = [
    'app.record.index.delete.submit',
    'app.record.detail.delete.submit',
]


kintone.events.on(indexShow, async (e: any) => {
    const record = e.record;
    const today = getFormattedDate(new Date())

    const reservationRecords = await getRecords({
        app: RESERVATION_APP_ID,
        filterCond: `room_number = ${record.room_number.value} and (check_in >= "${today}" or check_out >= "${today}")`,
        fields: ['$id'],
    });

    if (reservationRecords?.records.length == 0) {
        return e
    }

    return Swal.fire({
        text: "この部屋は予約されています。本当に削除したいですか？",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "いいえ",
        confirmButtonText: "はい",
    }).then((result) => {
        if (result.isConfirmed) return e
        return false
    })
})
