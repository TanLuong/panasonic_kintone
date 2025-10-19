import './summary.css'
import React from 'react';

export function Summary({
    count,
    guest,
    night,
    amount,
    roomType,
    reservationChanel,
}: {
    count: number,
    guest: number,
    night: number,
    amount: number,
    roomType: {[key: string]: number} | undefined,
    reservationChanel: {[key: string]: number} | undefined,
}) {

    const roomTypeTextList = [];
    const reservationChanelList = [];
    if (roomType) {
        for (const roomTypex in roomType) {
            roomTypeTextList.push(`${roomTypex}(${roomType[roomTypex]}件)`)
        }
    }
    if (reservationChanel) {
        for (const chanel in reservationChanel) {
            reservationChanelList.push(`${chanel}(${reservationChanel[chanel]}件)`)
        }
    }

    return (
        <div className="summary-box">
            <h3>今月の宿泊予約集計</h3>
            <div className="content">
                <div className="stats">
                    <span>予約総数: {count}件</span>
                    <span>宿泊人数: {guest}名</span>
                    <span>総宿泊日数: {night}泊</span>
                    <span>予約売上合計: ¥{amount.toLocaleString('en-US')}</span>
                </div>
                <div>部屋タイプ別: {roomTypeTextList.length > 0 ? roomTypeTextList.join(', ') : ''}</div>
                <div>予約経路別: {reservationChanelList.length > 0 ? reservationChanelList.join(', ') : ''}</div>
            </div>
        </div>
    )
}
