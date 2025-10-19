import { Button } from "kintone-ui-component";

declare const CUSTOMER_APP_ID: number;

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
            window.open(`/k/${CUSTOMER_APP_ID}/edit`, '_self' )
        })
        customerElement.appendChild(redirectCustomerButton)
        customerElement.style = 'display: flex; justify-content: center;'
        return e
    });
})();
