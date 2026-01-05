
export enum RoomStatus {
  Occupied = 'Occupied',
  CheckedOut = 'Checked Out',
  NotSupported = 'Not Supported',
  NotCheckedIn = 'Not Checked In',
}

export enum PaymentStatus {
  Prepaid = 'Prepaid',
  Onsite = 'Onsite Payment',
}

export enum ReservationStatus {
  not_yet_paid = "未支払い",
  paid_not_yet_checkin = "支払い済み、未チェックイン",
  paid_checking = "支払い済み＆チェックイン済み",
  cancelled = "キャンセル",
}

export interface Guest {
  name: string;
  adults: number;
  children: number;
  nights: number;
  price: number;
  paymentStatus: PaymentStatus;
  id: number;
  reservationId: number;
}

export interface Room {
  id: number;
  roomNumber: string;
  type: string;
  status: RoomStatus;
  guest?: Guest;
  notes?: {
    checkIn: string;
    checkOut: string;
    bookingSource: string;
    remarks: string;
  };
  cleaningCompleteTime?: string;
  description?: string;
}
