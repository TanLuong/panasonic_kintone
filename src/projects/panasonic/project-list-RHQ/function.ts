declare const kintone: any;

interface KintoneRecord {
    [key: string]: {
        value: string;
        disabled?: boolean;
    };
}

export function field_shown(field: string, status: boolean): void {
    kintone.app.record.setFieldShown(field, status);
}

export const disableField = (record: KintoneRecord, fields: string[]): void => {
    for (let field of fields) {
        record[field].disabled = true;
    }
};

export const enableField = (record: KintoneRecord, fields: string[]): void => {
    for (let field of fields) {
        record[field].disabled = false;
    }
};

export function hide_name_field(className: string, text: string): void {
    const field_name = document.querySelectorAll(`.${className}`);
    field_name.forEach((element) => {
        if (element.textContent == text) {
            (element as HTMLElement).style.display = 'none';
        }
    });
}

export const quarter = (month: number): string => {
    if (month >= 1 && month <= 3) return 'Q4';
    if (month >= 4 && month <= 6) return 'Q1';
    if (month >= 7 && month <= 9) return 'Q2';
    return 'Q3';
};

export const financialYear = (date: Date): string => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month >= 4) {
        return `FY${year}`;
    } else {
        return `FY${year - 1}`;
    }
};

export const PSI = (probability: string): string => {
    if (!probability) return 'LOST';
    const value = parseInt(probability.split('%')[0]);
    if (value >= 50) {
        return 'IN';
    }
    if (value == 10 || value == 30) {
        return 'OUT';
    }
    return 'LOST';
}
