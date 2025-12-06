
import { Button, Combobox } from "kintone-ui-component";
import { summaryElement } from "./logic/reservation-list";
import { getOptionsOfField, createDatalist, getDifferentDate, getRecords } from "../../../common/tools";
import * as fields from "./fields";

// Define types locally or import if available
type KintoneEvent = any;
declare const kintone: any;

// Helper to keep state
let allRooms: any[] = [];
let roomNumberDropdown: Combobox;

export const setAllRooms = (rooms: any[]) => { allRooms = rooms; }
export const getAllRooms = () => allRooms;

export const handleShow = async (event: KintoneEvent, startAppId: number, roomListAppId: number) => {
    const record = event.record;
    kintone.app.record.setFieldShown(fields.room_type, false);
    kintone.app.record.setFieldShown(fields.room_number, false);

    const customerElement: HTMLElement | null = kintone.app.record.getSpaceElement('customer_element');
    console.log('Customer Element:', customerElement); 

    if (customerElement) {
        // Clear previous content to prevent duplication if re-run
        customerElement.innerHTML = '';
        
        const redirectCustomerButton = new Button({
            type: "submit",
            text: "新規顧客登録",
        })
        redirectCustomerButton.addEventListener('click', () => {
            window.open(`/k/${startAppId}/edit`, '_self')
        })
        customerElement.appendChild(redirectCustomerButton)
        customerElement.style.cssText = 'display: flex; justify-content: center;'
    }

    // Fetch all rooms once
    try {
        const resp = await getRecords({
            app: roomListAppId,
            fields: [fields.room_number, fields.room_type, '$id']
        });
        if (resp && resp.records) {
            allRooms = resp.records;
        }
    } catch (error) {
        console.error("Failed to fetch rooms", error);
    }

    // Setup Room Number Dropdown
    setupRoomNumberDropdown(record, roomListAppId);
    
    // Setup Room Type Dropdown
    await setupRoomTypeDropdown(record, roomListAppId);

    return event;
}

const getRoomOptions = (rType: string) => {
    if (!rType) return [];
    return allRooms
    .filter(r => r[fields.room_type].value === rType)
    .map(r => ({ label: r[fields.room_number].value, value: r[fields.room_number].value }));
};

const setupRoomNumberDropdown = (record: any, roomListAppId: number) => {
    const roomNumberSpace = kintone.app.record.getSpaceElement('room_number');
    const initialRoomType = record[fields.room_type].value || '';
    const initialRoomNumber = record[fields.room_number].value || '';

    roomNumberDropdown = new Combobox({
        label: '部屋番号',
        items: [{ label: '-----', value: '' }, ...getRoomOptions(initialRoomType)],
        value: initialRoomNumber,
        requiredIcon: false,
        className: 'room-number-dropdown',
        visible: true,
        disabled: false,
        placeholder: '部屋番号を選択',
    });

    roomNumberDropdown.addEventListener('change', (event: any) => {
            const val = event.detail.value;
            let currentRecord = kintone.app.record.get();
            currentRecord.record[fields.room_number].value = val;
            kintone.app.record.set(currentRecord);
    });

    if (roomNumberSpace) {
        roomNumberSpace.innerHTML = ''; // Clear to prevent dupes
        roomNumberSpace.style.paddingLeft = '20px';
        roomNumberSpace.appendChild(roomNumberDropdown);
    }
}

const setupRoomTypeDropdown = async (record: any, roomListAppId: number) => {
    const optionItems = await getOptionsOfField(roomListAppId, fields.room_type);
    const roomTypeElement: HTMLElement | null = kintone.app.record.getSpaceElement('room_type');
    const initialRoomType = record[fields.room_type].value || '';

    const roomtypeDropdown = new Combobox({
        label: '部屋タイプ',
        items: [{label: '-------------------------------', value:''}, ...optionItems.map((option: any) => ({ label: option, value: option }))],
        value: initialRoomType,
        requiredIcon: true,
        className: 'options-class',
        id: 'options-id',
        visible: true,
        disabled: false,
        placeholder: '部屋タイプを選択してください',
    })
    
    roomtypeDropdown.addEventListener('change', (event:any) => {
        const newRoomType = event.detail.value;
        let currentRec = kintone.app.record.get();
        currentRec.record[fields.room_type].value = newRoomType;
        
        // Update Room Number options
        // We need to access roomNumberDropdown. 
        // Since it's module level, this works.
        if (roomNumberDropdown) {
             const newRoomOptions = [{ label: '-----', value: '' }, ...getRoomOptions(newRoomType)];
             roomNumberDropdown.items = newRoomOptions;
             
             // Clear invalid room number
             currentRec.record[fields.room_number].value = ''; 
             roomNumberDropdown.value = '';
        }

        kintone.app.record.set(currentRec);
    })
    
    if (roomTypeElement) {
        roomTypeElement.innerHTML = ''; // Clear
        roomTypeElement.appendChild(roomtypeDropdown)
    }
}

export const handleIndexShow = async (event: KintoneEvent, roomListAppId: number, reservationViewId: number) => {
    const dataOptions = await getOptionsOfField(roomListAppId, fields.room_type);
    createDatalist(dataOptions, fields.room_type); 

    const appID = event.appId;

    if (event.viewId == reservationViewId) {
        const headerSpace = kintone.app.getHeaderSpaceElement();
        const summary_el = document.getElementById('summary_month');
        if (!summary_el && headerSpace) {
            const el = await summaryElement(appID);
            headerSpace.appendChild(el);
        }
    }
    return event;
}

export const handleDetailShow = (event: KintoneEvent) => {
    const roomTypeElement: HTMLElement | null = kintone.app.record.getSpaceElement('room_type');
    const roomNumberElement: HTMLElement | null = kintone.app.record.getSpaceElement('room_number');
    if (roomTypeElement && roomTypeElement.parentElement) {
            roomTypeElement.parentElement.style.display = 'none';
    }
    if (roomNumberElement && roomNumberElement.parentElement) {
            roomNumberElement.parentElement.style.display = 'none';
    }
    return event;
}

export const handleIndexEditShow = (event: KintoneEvent) => {
    const record = event.record;
    const roomTypeElementList: HTMLElement[] = kintone.app.getFieldElements(fields.room_type);
    if (roomTypeElementList) {
        const roomTypeEditElement = roomTypeElementList.find((element) => {
            return element.getElementsByTagName('input').length > 0;
        })
        const roomTypeInput = roomTypeEditElement?.getElementsByTagName('input')[0] as HTMLInputElement;
        if (roomTypeInput) {
            roomTypeInput.setAttribute('list', 'datalist-' + fields.room_type);
        }
    }
    if (!!record[fields.room_number].value) {
        record[fields.room_type].disabled = true;
    }
    return event;
}

export const handleSubmit = (event: KintoneEvent) => {
    const record = event.record;
    const nightDiff = getDifferentDate(record[fields.check_in].value, record[fields.check_out].value);
    
    console.log('night:', nightDiff);
    if (nightDiff <= 0) {
        record[fields.check_out].error = "チェックアウト日はチェックイン日と同じかそれ以前であってはなりません";
        event.error = "予約日数は0より大きくなければなりません";
    }
    
    // Validate Room Type and Number consistency
    const rType = record[fields.room_type].value;
    const rNum = record[fields.room_number].value;
    
    if (rType && rNum) {
        if (allRooms.length > 0) {
            const isValid = allRooms.some(r => r[fields.room_type].value === rType && r[fields.room_number].value === rNum);
            if (!isValid) {
                    record[fields.room_number].error = "選択された部屋番号は指定された部屋タイプと一致しません。";
                    event.error = "入力内容を確認してください。";
            }
        }
    }
    
    return event;
}

export const handleHideCustomer = (event: KintoneEvent) => {
    kintone.app.record.setFieldShown(fields.customer_id, false);
    return event;
}
