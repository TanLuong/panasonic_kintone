
declare const kintone: any;
declare const krewsheet: any;

(function () {
    ('use strict');
    const quarter = (month: number): string => {
        if (month >= 1 && month <= 3) return 'Q4';
        if (month >= 4 && month <= 6) return 'Q1';
        if (month >= 7 && month <= 9) return 'Q2';
        return 'Q3';
    };

    const financialYear = (date: Date): string => {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        if (month >= 4) {
            return `FY${year}`;
        } else {
            return `FY${year - 1}`;
        }
    };

    const submitEvents: string[] = [
        'app.record.create.submit',
        'app.record.edit.submit',
        'app.record.index.edit.submit',
        'mobile.app.record.create.submit',
        'mobile.app.record.edit.submit',
    ]

    kintone.events.on('app.record.index.show', function (e) {
        krewsheet.events.on('app.record.index.edit.submit', function (event) {
            let record = event.records[0];
            console.log("submit event before modify:", event)
            if (record.sale_date.value != '') {
                let date = new Date(record.sale_date.value);
                let month = date.toLocaleString('en-US', { month: 'short' });
                record.financial_year.value = financialYear(date);
                record.quarter.value = quarter(date.getMonth() + 1);
                //   record.exchange_rate.value = exchangeRateDictionary[`${month}${date.getFullYear()}`] || '';
                // if (!record.unit_price_in_SGD.value && !record.unit_price_in_USD.value) {
                //     event.error = 'Unit Price is required, please enter value for one of currency';
                // }
            }
            console.log("submit event after modify:", event)
            return event;
        });
    });
})();
