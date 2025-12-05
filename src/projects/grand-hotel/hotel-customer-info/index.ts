import { Button } from "kintone-ui-component";
import { findAllFieldRoutes, getElementOfFieldCode } from "../../../common/kintone-tools";
declare const CUSTOMER_APP_ID: number;
declare const kintone: any;

(function () {
    ('use strict');
    const customerElementID = 'customer_element'
    const showEvents: string[] = [
        'app.record.create.show',
        'app.record.edit.show',
    ]

    kintone.events.on(showEvents, async (e: any) => {
        const fieldLayout = await kintone.app.getFormLayout();
        const routeMap = findAllFieldRoutes(fieldLayout);
        const mobileElement = await getElementOfFieldCode('mobile_phone', routeMap);
        const phoneElement = await getElementOfFieldCode('desk_phone', routeMap);
        if (mobileElement) {
            const mobileInputElement = mobileElement.querySelector('input');
            mobileInputElement?.setAttribute('placeholder', 'ハイフンなし');
        }
        if (phoneElement) {
            const phoneInputElement = phoneElement.querySelector('input');
            phoneInputElement?.setAttribute('placeholder', 'ハイフンなし');
        }
        console.log('routeMap', routeMap);
        console.log('mobileElement', mobileElement);
        console.log('phoneElement', phoneElement);
        return e
    });
})();
