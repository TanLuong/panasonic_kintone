import { Room, RoomStatus, PaymentStatus, Guest } from './types';
import * as fields from './fields';
import { getRecords } from '../../../common/tools';
import { getFormattedDate, greaterDate } from '../../../common/tools';

// Declare Kintone global object to satisfy TypeScript
declare const kintone: any;

// Helper function to call Kintone API for fetching records


// Merges room and reservation data using a Map for efficient lookup.
const mergeRoomData = (reservationRecords: any[], roomRecords: any[]): any[] => {
    const reservationMap = new Map<string, any>();
    for (const res of reservationRecords) {
        if (res[fields.room_number]?.value) {
            reservationMap.set(res[fields.room_number].value, res);
        }
    }

    return roomRecords.map((roomRecord: any) => {
        const roomNumber = roomRecord[fields.room_number].value;
        const reservation = reservationMap.get(roomNumber);

        if (reservation) {
            const agregateMemos = [
                reservation[fields.customer_memo]?.value || '',
                reservation[fields.internal_memo]?.value || '',
            ].filter(Boolean);

            if (reservation[fields.memos]?.value?.length > 0) {
                reservation[fields.memos].value.forEach((memo: any) => {
                    if (memo.value[fields.customer_memo]?.value) agregateMemos.push(memo.value[fields.customer_memo].value);
                    if (memo.value[fields.internal_memo]?.value) agregateMemos.push(memo.value[fields.internal_memo].value);
                });
            }

            return {
                room_number: roomRecord[fields.room_number].value,
                room_type: roomRecord[fields.room_type].value,
                customer_name: reservation[fields.customer_name].value,
                customer_id: reservation[fields.customer_id]?.value || '',
                memos: agregateMemos.join(', '),
                check_in: reservation[fields.check_in].value,
                check_out: reservation[fields.check_out].value,
                reservation_chanel: reservation[fields.reservation_chanel].value,
                night: reservation[fields.night].value,
                adult: reservation[fields.adult].value,
                child: reservation[fields.child].value,
                price: reservation[fields.price].value,
                payment_method: reservation[fields.payment_method].value,
                reservation_id: reservation.$id.value,
            };
        }
        return {
            room_number: roomRecord[fields.room_number].value,
            room_type: roomRecord[fields.room_type].value,
            room_description: roomRecord[fields.room_description]?.value || '',
        };
    });
};

// Maps the merged Kintone data to the application's Room[] type.
const mapDataToRooms = (data: any[]): Room[] => {
    return data.map((record, index) => {
        const isOccupied = !!record.customer_name;
        let currentDate = new Date();
        let status = RoomStatus.Available;
        if (isOccupied && greaterDate(getFormattedDate(currentDate), record.check_out)) {
            status = RoomStatus.CheckedOut;
        } else if (isOccupied && greaterDate(record.check_in, getFormattedDate(currentDate))) {
            status = RoomStatus.NotSupported;
        } else if (isOccupied) {
            status = RoomStatus.Occupied;
        }


        let guest: Guest | undefined = undefined;
        if (isOccupied) {
            let paymentStatus = PaymentStatus.Onsite; // Default value
            if (record.payment_method === 'Prepaid') {
                paymentStatus = PaymentStatus.Prepaid;
            }

            guest = {
                name: record.customer_name,
                adults: parseInt(record.adult || '0', 10),
                children: parseInt(record.child || '0', 10),
                nights: parseInt(record.night || '0', 10),
                price: parseInt(record.price || '0', 10),
                paymentStatus: paymentStatus,
                id: record.customer_id || 0,
                reservationId: parseInt(record.reservation_id || '0', 10),
            };
        }
        
        return {
            id: index + 1, // Using index as a stable key for React
            roomNumber: record.room_number,
            type: record.room_type,
            status,
            guest: guest,
            notes: isOccupied ? {
                checkIn: record.check_in || '',
                checkOut: record.check_out || '',
                bookingSource: record.reservation_chanel || '',
                remarks: record.memos || '',
            } : undefined,
            description: record.room_description || '',
        };
    });
};

// Main function to fetch and process all hotel data.
export const fetchHotelData = async (reservationAppId: number, roomAppId: number, date: string): Promise<Room[]> => {
    if (typeof kintone === 'undefined') {
        throw new Error("Kintone JS SDK not found. This app must be run within a Kintone environment.");
    }
    

    const reservationRequest = getRecords({
        app: reservationAppId,
        filterCond: `${fields.check_in} <= "${date}" and ${fields.check_out} >= "${date}" and status in ("完了")`,
        sortConds: [fields.room_number],
        fields: [...Object.values(fields), '$id'],
    });

    const roomRequest = getRecords({
        app: roomAppId,
        sortConds: [`${fields.room_number} asc`],
        fields: [fields.room_number, fields.room_type, fields.room_description],
    });

    const [reservationResponse, roomResponse] = await Promise.all([reservationRequest, roomRequest]);

    const reservationRecords = reservationResponse?.records || [];
    const roomRecords = roomResponse?.records || [];
    
    const mergedData = mergeRoomData(reservationRecords, roomRecords);
    const rooms = mapDataToRooms(mergedData);
    return rooms;
}
