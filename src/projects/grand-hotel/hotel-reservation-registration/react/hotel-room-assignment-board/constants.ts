import { check } from 'zod';
import { Room, RoomStatus, PaymentStatus } from './types';
import { adult } from '../../fields';

// This file is no longer in use. Data is now fetched from the Kintone API.
// You can remove this file if it is no longer needed for other purposes.

export const mockRooms: Room[] = [];

export const textDict = {
    [RoomStatus.Occupied]: '宿泊中',
    [RoomStatus.Available]: '空室',
    [RoomStatus.Cleaning]: '清掃中',
    [PaymentStatus.Prepaid]: '事前決済済',
    [PaymentStatus.Onsite]: '現地支払い',
    header_summary: "今月の部屋割り状況",
    total_rooms: "総客室数",
    occupied_rooms: "稼働客室",
    total_guests: "宿泊人数",
    occupancy_rate: "稼働率",
    total_revenue: "売上合計",
    check_in: "チェックイン",
    check_out: "チェックアウト",
    booking_source: "予約経路",
    notes: "備考",
    adults: "大人",
    nights: "泊",
    person_unit: "名",
}
