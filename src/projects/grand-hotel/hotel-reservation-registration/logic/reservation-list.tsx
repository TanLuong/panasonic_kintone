import { createRoot } from 'react-dom/client';
import React from 'react';

import { Summary } from "../react/summary";
import { getRecords } from "../../../../common/tools";
import {
    adult,
    child,
    reservation_chanel,
    night,
    price,
    room_type,
} from '../fields'

declare const kintone: any;


export const summaryElement = async (appID: number) => {
    const query: string = kintone.app.getQuery();
    const parseQuery = query.split('order by')[0]
    const response = await getRecords({
        app: appID,
        filterCond:
            parseQuery,
        sortConds: [],
        fields: [
            adult,
            child,
            night,
            price,
            room_type,
            reservation_chanel,
        ]
    })

    const unknownRoute = "未知";

    const sumaryData = response && response.records.reduce((pre: any, cur: any) => {
        pre['count']++
        pre['guest'] += parseInt(cur[adult].value || 0) + parseInt(cur[child].value || 0)
        pre['night'] += parseInt(cur[night].value || 0)
        pre['amount'] += parseInt(cur[price].value || 0)
        if (!pre['roomType'][cur[room_type].value]) {
            pre['roomType'][cur[room_type].value] = 1
        } else pre['roomType'][cur[room_type].value]++
        cur[reservation_chanel].value ??= unknownRoute
        if (!pre['reservationChanel'][cur[reservation_chanel].value]) {
            pre['reservationChanel'][cur[reservation_chanel].value] = 1
        } else pre['reservationChanel'][cur[reservation_chanel].value ]++
        return pre
    }, {
        count: 0,
        guest: 0,
        night: 0,
        amount: 0,
        roomType: {},
        reservationChanel: {}
    })
    const el = document.createElement('div');
    el.id = 'summary_month'
    const root = createRoot(el);
    root.render(<Summary {...sumaryData}/>);

    return el
}
