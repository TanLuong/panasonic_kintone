import { createRoot } from "react-dom/client";

import { Button, Combobox } from "kintone-ui-component";
import { summaryElement } from "./logic/reservation-list";
import App from "./react/hotel-room-assignment-board/App";
import { getOptionsOfField, createDatalist, getDifferentDate } from "../../../common/tools";
import * as fields from "./fields";


declare const CUSTOMER_APP_ID: number;
declare const RESERVATION_VIEW_ID: number;
declare const kintone: any;
declare const ROOM_LIST_VIEW_ID: number;
declare const ROOM_LIST_APP_ID: number;

(function () {
    ('use strict');
    const customerElementID = 'customer_element'
    const roomTypeElementID = 'room_type'
    const showEvents: string[] = [
        'app.record.create.show',
        'app.record.edit.show',
    ]

    kintone.events.on(showEvents, async (e: any) => {
        const record = e.record;
        kintone.app.record.setFieldShown(fields.room_type, false);
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

        // 
        const optionItems = await getOptionsOfField(ROOM_LIST_APP_ID, fields.room_type);
        const roomTypeElement: HTMLElement = kintone.app.record.getSpaceElement(roomTypeElementID)
        const roomtypeDropdown = new Combobox({
            label: '部屋タイプ',
            items: [{label: '-------------------------------', value:''}, ...optionItems.map((option: any) => ({ label: option, value: option }))],
            value: record[fields.room_type].value ?? '',
            requiredIcon: true,
            className: 'options-class',
            id: 'options-id',
            visible: true,
            disabled: false,
            placeholder: '部屋タイプを選択してください',
        })
        roomtypeDropdown.addEventListener('change', (e:any) => {
            let record = kintone.app.record.get();
            record.record['room_type'].value = e?.detail?.value;
            kintone.app.record.set(record);
        })
        roomTypeElement.appendChild(roomtypeDropdown)
        return e
    });

    const indexShow = [
        'app.record.index.show',
    ]

    kintone.events.on(indexShow, async (e: any) => {
        const dataOptions = await getOptionsOfField(ROOM_LIST_APP_ID, fields.room_type);
        createDatalist(dataOptions, fields.room_type); 

        const appID = e.appId;

        if (e.viewId == RESERVATION_VIEW_ID) {
            const headerSpace = kintone.app.getHeaderSpaceElement();
            const summary_el = document.getElementById('summary_month');
            if (!summary_el) {
                const el = await summaryElement(appID);
                headerSpace.appendChild(el);
            }
            
        }

        if (e.viewId == ROOM_LIST_VIEW_ID) {
            const container = document.getElementById('root')
            if (!container) {
                e.error = 'Container element not found';
            }

            const root = createRoot(container!);
            root.render(<App />);
            const headerSpace = kintone.app.getHeaderMenuSpaceElement();

            let print = document.getElementById("print-button");
            if (!print) {
                print = new Button({
                    type: "submit",
                    text: "印刷",
                })
            }
            print.addEventListener('click', () => {
                window.print();
            })
            headerSpace.appendChild(print);
        }
        return e;
    })

    const showDetailEvents: string[] = [
        'app.record.detail.show',
        'mobile.app.record.detail.show',
    ]
    kintone.events.on(showDetailEvents, (e: any) => {
        const roomTypeElement: HTMLElement = kintone.app.record.getSpaceElement(roomTypeElementID)
        const parentElement = roomTypeElement.parentElement as HTMLElement;
        parentElement.style.display = 'none';
        return e;
    });

    const indexEditEvents: string[] = [
        'app.record.index.edit.show',
    ]
    kintone.events.on(indexEditEvents, (e: any) => {
        const record = e.record;
        const roomTypeElementList: HTMLElement[] = kintone.app.getFieldElements(fields.room_type);
        const roomTypeEditElement = roomTypeElementList.find((element) => {
            return element.getElementsByTagName('input').length > 0;
        })
        const roomTypeInput = roomTypeEditElement?.getElementsByTagName('input')[0] as HTMLInputElement;
        if (roomTypeInput) {
            roomTypeInput.setAttribute('list', 'datalist-' + fields.room_type);
        }
        if (!!record[fields.room_number].value) {
            record[fields.room_type].disabled = true;
        }
        return e;
    });

    const submitEvents: string[] = [
        'app.record.index.edit.submit',
        'app.record.edit.submit',
        'app.record.create.submit',
    ]

    kintone.events.on(submitEvents, (e: any) => {
        const record = e.record;
        const night = getDifferentDate(record[fields.check_in].value, record[fields.check_out].value)
        console.log('night:', night)
        if (night <= 0) {
            record[fields.check_out].error = "チェックアウト日はチェックイン日と同じかそれ以前であってはなりません";
            e.error = "予約日数は0より大きくなければなりません";
        }
        return e
    })
})();
