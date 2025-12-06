
export enum RoomStatus {
  Occupied = 'Occupied',
  Available = 'Available',
  CheckedOut = 'Checked Out',
  NotSupported = 'Not Supported',
}

export enum PaymentStatus {
  Prepaid = 'Prepaid',
  Onsite = 'Onsite Payment',
}

export enum ReservationStatus {
  Unprocessed = '未対応',
  InProgress = '対応中',
  Completed = '完了',
  Cancelled = 'キャンセル',
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
