import { Button } from "kintone-ui-component";
import React from "react";
import { createRoot } from 'react-dom/client';

import { Summary } from "./react/summary";
import { getRecords } from "../tools";

declare const CUSTOMER_APP_ID: number;
declare const RESERVATION_VIEW_ID: number;
declare const kintone: any;

(function () {
    ('use strict');
    const customerElementID = 'customer_element'
    const adult = 'adult';
    const child = 'child';
    const night = 'night';
    const price = 'price';
    const room_type = 'room_type';
    const reservation_chanel = 'reservation_chanel';

    const showEvents: string[] = [
        'app.record.create.show',
        'app.record.edit.show',
    ]

    kintone.events.on(showEvents, function (e: any) {
        const customerElement: HTMLElement = kintone.app.record.getSpaceElement(customerElementID)
        const redirectCustomerButton = new Button({
            type: "submit",
            text: "新規顧客登録",
        })
        redirectCustomerButton.addEventListener('click', () => {
            window.open(`/k/${CUSTOMER_APP_ID}/edit`, '_self')
        })
        customerElement.appendChild(redirectCustomerButton)
        customerElement.style = 'display: flex; justify-content: center;'
        return e
    });

    const indexShow = [
        'app.record.index.show',
    ]

    kintone.events.on(indexShow, async (e: any) => {
        
        const appID = e.appId;
        
        if (e.viewId == RESERVATION_VIEW_ID) {
            const headerSpace = kintone.app.getHeaderSpaceElement();
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

            const sumaryData = response && response.records.reduce((pre: any, cur: any) => {
                pre['count']++
                pre['guest'] += parseInt(cur[adult].value || 0) + parseInt(cur[child].value || 0)
                pre['night'] += parseInt(cur[night].value || 0)
                pre['amount'] += parseInt(cur[price].value || 0)
                if (!pre['roomType'][cur[room_type].value]) {
                    pre['roomType'][cur[room_type].value] = 1
                } else pre['roomType'][cur[room_type].value]++

                if (!pre['reservationChanel'][cur[reservation_chanel].value]) {
                    pre['reservationChanel'][cur[reservation_chanel].value] = 1
                } else pre['reservationChanel'][cur[reservation_chanel].value]++
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
            const root = createRoot(el);
            root.render(<Summary {...sumaryData}/>); // ✅ correct usage

            headerSpace.appendChild(el)
        }
        return e
    })

})();
