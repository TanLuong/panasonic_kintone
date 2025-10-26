
import React from 'react';
import './RoomCard.css';
import { Room, RoomStatus, PaymentStatus } from '../types';
import { textDict } from '../constants';

interface RoomCardProps {
  room: Room;
}

const statusStyles: { [key in RoomStatus]: string } = {
  [RoomStatus.Occupied]: 'status-occupied',
  [RoomStatus.Available]: 'status-available',
  [RoomStatus.Cleaning]: 'status-cleaning',
};

const paymentStatusStyles: { [key in PaymentStatus]: string } = {
  [PaymentStatus.Prepaid]: 'payment-prepaid',
  [PaymentStatus.Onsite]: 'payment-onsite',
};

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  return (
    <div className="room-card">
      <div className="room-card-header">
        <div>
          <h3 className="room-number">{room.roomNumber}</h3>
          <p className="room-type">{room.type}</p>
        </div>
        <span className={`status-badge ${statusStyles[room.status]}`}>
          {textDict[room.status]}
        </span>
      </div>
      <div className="room-card-body">
        {room.status === RoomStatus.Occupied && room.guest ? (
          <div>
            <div className="guest-info">
              <h4 className="guest-name">{room.guest.name}</h4>
              <div className="guest-meta">
                <span>{textDict['adults']}: {room.guest.adults}</span>
                <span>{room.guest.nights} {textDict['nights']}</span>
                <span>¥{room.guest.price.toLocaleString()}</span>
              </div>
              <span className={`payment-badge ${paymentStatusStyles[room.guest.paymentStatus]}`}>
                {textDict[room.guest.paymentStatus]}
              </span>
            </div>
            {room.notes && (
              <div className="notes">
                <p><strong>{textDict['check_in']}:</strong> {room.notes.checkIn}</p>
                <p><strong>{textDict['check_out']}:</strong> {room.notes.checkOut}</p>
                <p><strong>{textDict['booking_source']}:</strong> {room.notes.bookingSource}</p>
                {room.notes.remarks && <p><strong>{textDict['notes']}:</strong> {room.notes.remarks}</p>}
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <div>
                {room.status === RoomStatus.Available ? 'Room is available' : `Cleaning (Until ${room.cleaningCompleteTime || 'N/A'})`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
