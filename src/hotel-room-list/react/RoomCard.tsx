import React from "react";
import "./RoomCard.css";

type RoomStatus = "occupied" | "available" | "cleaning";
type PaymentStatus = "prepaid" | "onsite" | undefined;

export interface RoomCardProps {
  roomNumber: string;
  roomType: string;
  status: RoomStatus;
  guestName?: string;
  guestDetails?: string[];
  paymentStatus?: PaymentStatus;
  notes?: string;
  emptyMessage?: string;
}

const RoomCard: React.FC<RoomCardProps> = ({
  roomNumber,
  roomType,
  status,
  guestName,
  guestDetails = [],
  paymentStatus,
  notes,
  emptyMessage,
}) => {
  const getStatusClass = (): string => {
    switch (status) {
      case "occupied":
        return "status-occupied";
      case "available":
        return "status-available";
      case "cleaning":
        return "status-cleaning";
      default:
        return "";
    }
  };

  const getStatusLabel = (): string => {
    switch (status) {
      case "occupied":
        return "宿泊中";
      case "available":
        return "空室";
      case "cleaning":
        return "清掃中";
      default:
        return "";
    }
  };

  const getPaymentClass = (): string => {
    switch (paymentStatus) {
      case "prepaid":
        return "payment-prepaid";
      case "onsite":
        return "payment-onsite";
      default:
        return "";
    }
  };

  const getPaymentLabel = (): string => {
    switch (paymentStatus) {
      case "prepaid":
        return "事前決済済";
      case "onsite":
        return "現地支払い";
      default:
        return "";
    }
  };

  return (
    <div className="room-card">
      <div className="room-header">
        <div>
          <div className="room-number">{roomNumber}</div>
          <div className="room-type">{roomType}</div>
        </div>
        <div className={`room-status ${getStatusClass()}`}>{getStatusLabel()}</div>
      </div>

      <div className="room-content">
        {status === "occupied" ? (
          <>
            <div className="guest-info">
              <div className="guest-name">{guestName} 様</div>
              <div className="guest-details">
                {guestDetails.map((detail, index) => (
                  <div key={index} className="detail-item">
                    {detail}
                  </div>
                ))}
              </div>
              {paymentStatus && (
                <div className={`payment-status ${getPaymentClass()}`}>
                  {getPaymentLabel()}
                </div>
              )}
            </div>
            {notes && (
              <div
                className="special-notes"
                dangerouslySetInnerHTML={{ __html: notes }}
              />
            )}
          </>
        ) : (
          <div className="empty-room">{emptyMessage}</div>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
