import { createRoot } from "react-dom/client";

import { Button } from "kintone-ui-component";
import { summaryElement } from "./logic/reservation-list";
import App from "./react/hotel-room-assignment-board/App";


declare const CUSTOMER_APP_ID: number;
declare const RESERVATION_VIEW_ID: number;
declare const kintone: any;
declare const ROOM_LIST_VIEW_ID: number;

(function () {
    ('use strict');
    const customerElementID = 'customer_element'
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
            const el = await summaryElement(appID);
            headerSpace.appendChild(el);
        }

        if (e.viewId == ROOM_LIST_VIEW_ID) {
            const container = document.getElementById('root')
            if (!container) {
                e.error = 'Container element not found';
            }
            
            const root = createRoot(container!);
            root.render(<App />);
        }

        return e;
    })

})();
