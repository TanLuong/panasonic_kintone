
import React from 'react';
import './Summary.css';
import { Room, RoomStatus } from '../types';
import { textDict } from '../constants';

interface SummaryProps {
  rooms: Room[];
}

const Summary: React.FC<SummaryProps> = ({ rooms }) => {
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(room => room.status === RoomStatus.Occupied).length;
  const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms * 100).toFixed(1) : '0.0';
  
  const totalGuests = rooms.reduce((acc, room) => {
    if (room.status === RoomStatus.Occupied && room.guest) {
      return acc + room.guest.adults + room.guest.children;
    }
    return acc;
  }, 0);

  const totalRevenue = rooms.reduce((acc, room) => {
    if (room.status === RoomStatus.Occupied && room.guest) {
      return acc + room.guest.price;
    }
    return acc;
  }, 0);

  const SummaryItem: React.FC<{ label: string; value: string | number; unit?: string }> = ({ label, value, unit }) => (
    <div className="summary-item">
      <span className="summary-label">{label}:</span>
      <span className="summary-value">{value}</span>
      {unit && <span className="summary-unit">{unit}</span>}
    </div>
  );

  return (
    <div className="summary-card">
      <h2 className="summary-title">{textDict['header_summary']}</h2>
      <div className="summary-items">
        <SummaryItem label={textDict["total_rooms"]} value={totalRooms} unit="室" />
        <SummaryItem label={textDict["occupied_rooms"]} value={occupiedRooms} unit="室" />
        <SummaryItem label={textDict["total_guests"]} value={totalGuests} unit="名" />
        <SummaryItem label={textDict["occupancy_rate"]} value={occupancyRate} unit="%" />
        <SummaryItem label={textDict["total_revenue"]} value={`¥${totalRevenue.toLocaleString()}`} />
      </div>
    </div>
  );
};

export default Summary;
