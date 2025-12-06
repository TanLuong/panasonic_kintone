
import { createRoot } from "react-dom/client";
import { 
    handleShow,
    handleIndexShow,
    handleDetailShow,
    handleIndexEditShow,
    handleSubmit,
    handleHideCustomer
} from "./handlers";

declare const CUSTOMER_APP_ID: number;
declare const RESERVATION_VIEW_ID: number;
declare const kintone: any;
declare const ROOM_LIST_VIEW_ID: number;
declare const ROOM_LIST_APP_ID: number;


(function () {
    ('use strict');
    
    // Show Events
    const showEvents: string[] = [
        'app.record.create.show',
        'app.record.edit.show',
    ]
    kintone.events.on(showEvents, async (e: any) => {
        return handleShow(e, CUSTOMER_APP_ID, ROOM_LIST_APP_ID);
    });

    // Index Show Events
    const indexShow = [
        'app.record.index.show',
    ]
    kintone.events.on(indexShow, async (e: any) => {
        return handleIndexShow(e, ROOM_LIST_APP_ID, RESERVATION_VIEW_ID);
    })

    // Detail Show Events
    const showDetailEvents: string[] = [
        'app.record.detail.show',
        'mobile.app.record.detail.show',
    ]
    kintone.events.on(showDetailEvents, (e: any) => {
        return handleDetailShow(e);
    });

    // Index Edit Events
    const indexEditEvents: string[] = [
        'app.record.index.edit.show',
    ]
    kintone.events.on(indexEditEvents, (e: any) => {
        return handleIndexEditShow(e);
    });

    // Submit Events
    const submitEvents: string[] = [
        'app.record.index.edit.submit',
        'app.record.edit.submit',
        'app.record.create.submit',
    ]
    kintone.events.on(submitEvents, (e: any) => {
        return handleSubmit(e);
    })

    // Hide Customer ID Events
    const hideCustomerIdEvents: string[] = [
        'app.record.create.show',
        'app.record.edit.show',
        'app.record.detail.show',
    ]
    kintone.events.on(hideCustomerIdEvents, (e: any) => {
        return handleHideCustomer(e);
    });
})();
