import React from "react";
import RoomCard from "./RoomCard";

const RoomGrid: React.FC = () => {
  const rooms = [
    {
      roomNumber: "101",
      roomType: "デラックス",
      status: "occupied" as const,
      guestName: "山田 太郎",
      guestDetails: ["大人2名", "2泊", "¥48,000"],
      paymentStatus: "prepaid" as const,
      notes: `
        チェックイン: 2025/05/15 15:00<br>
        チェックアウト: 2025/05/17<br>
        予約経路: 電話<br>
        備考: 禁煙希望、高層階希望
      `,
    },
    {
      roomNumber: "104",
      roomType: "スタンダード",
      status: "available" as const,
      emptyMessage: "本日は空室です",
    },
    {
      roomNumber: "105",
      roomType: "デラックス",
      status: "cleaning" as const,
      emptyMessage: "清掃・点検中<br><small>14:00頃完了予定</small>",
    },
  ];

  return (
    <div className="room-grid">
      {rooms.map((room) => (
        <RoomCard key={room.roomNumber} {...room} />
      ))}
    </div>
  );
};

export default RoomGrid;
