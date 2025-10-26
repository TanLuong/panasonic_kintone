import React from "react";
import "./RoomCard.css";

interface SummaryRoom {
    totalRooms: number;
    operatingRooms: number;
    guest: number;
    amount: number;
    availableRooms: string;
}

const HeaderRoom: React.FC<SummaryRoom> = ({
    totalRooms,
    operatingRooms,
    guest,
    amount,
    availableRooms,
}) => {
    return (
        <div className="header-room-box">
            <div className="header-room-item">総部屋数: {totalRooms}室</div>
            <div className="header-room-item">稼働中の部屋数: {operatingRooms}室</div>
            <div className="header-room-item">宿泊人数: {guest}名</div>
            <div className="header-room-item">売上合計: ¥{amount.toLocaleString('en-US')}</div>
            <div className="header-room-item">空室率: {availableRooms}%</div>
        </div>
    );  
}  

export default HeaderRoom;
