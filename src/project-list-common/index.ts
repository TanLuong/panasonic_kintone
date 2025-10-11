

(function () {
  ('use strict');
  
    interface KintoneRecord {
    [key: string]: {
        value: string;
        disabled?: boolean;
    };
    }



    function field_shown(field: string, status: boolean): void {
    kintone.app.record.setFieldShown(field, status);
    }

    const disableField = (record: KintoneRecord, fields: string[]): void => {
    for (let field of fields) {
        record[field].disabled = true;
    }
    };

    const enableField = (record: KintoneRecord, fields: string[]): void => {
    for (let field of fields) {
        record[field].disabled = false;
    }
    };

    function hide_name_field(className: string, text: string): void {
    const field_name = document.querySelectorAll(`.${className}`);
    field_name.forEach((element) => {
        if (element.textContent == text) {
        (element as HTMLElement).style.display = 'none';
        }
    });
    }

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

    const PSI = (probability: string): string => {
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

    const disableFields: string[] = [
        'financial_year',
        'psi',
    ]

    const tableField = 'table';
    const quarterInTable = 'quarter_t';
    const noInTable = 'No_t';
    const saleMonthTable = 'sale_month_year_t';
    const saleDateTable = 'sale_date_t';

    const disbleTableFields: string[] = [
        quarterInTable,
        noInTable,
        saleMonthTable,
    ]

    


  const saleDateChangeEvents: string[] = [
    'app.record.create.change.sale_date',
    'app.record.edit.change.sale_date',
    'app.record.index.edit.change.sale_date',
    'mobile.app.record.create.change.sale_date',
    'mobile.app.record.edit.change.sale_date',
  ]

  kintone.events.on(saleDateChangeEvents, (event: any) => {
    let record = event.record;
    if (record.sale_date.value != '') {
      let date = new Date(record.sale_date.value);
      record.financial_year.value = financialYear(date);
      record.quarter.value = quarter(date.getMonth() + 1);
    } else {
      record.financial_year.value = '';
      record.quarter.value = '';
    }
    return event;
  });

  const probilityChangeEvents: string[] = [
    'app.record.create.change.probability',
    'app.record.edit.change.probability',
    'app.record.index.edit.change.probability',
    'mobile.app.record.create.change.probability',
    'mobile.app.record.edit.change.probability',
  ]

  kintone.events.on(probilityChangeEvents, (event) => {
    let record = event.record;
    record.psi.value = PSI(record.probability.value);
    return event;
  });




  
  const showEvents: string[] = [
    'app.record.create.show',
    'app.record.edit.show',
    'app.record.index.edit.show',
    'app.record.detail.show',
    'mobile.app.detail.show',
    'mobile.app.record.create.show',
    'mobile.app.record.edit.show',
  ]

  kintone.events.on(showEvents, function (event) {
    var record = event.record;
    disableField(record, disableFields);
    record.psi.value = PSI(record.probability.value);
    
    // Disable table fields
    let numberRow = record[tableField].value.length;
    for (let i=0; i < numberRow; i++) {
        disbleTableFields.forEach(e => record[tableField].value[i].value[e].disabled=true)
    }
    return event;
  });


  const successEvents: string[] = [
    'app.record.create.submit',
    'app.record.edit.submit',
    'app.record.index.edit.submit',
    'mobile.app.record.create.submit',
    'mobile.app.record.edit.submit',
  ]

  kintone.events.on(successEvents, function (event) {
    let record = event.record;
    if (!record) return event;
    let date = new Date(record.sale_date.value);
    record.financial_year.value = financialYear(date);
    record.quarter.value = quarter(date.getMonth() + 1);
    
    // autofill in table
    let numberRow = record[tableField].value.length;
    for (let i=0; i < numberRow; i++) {
        // fill No
        record[tableField].value[i].value[noInTable].value = i + 1;
        // fill quarter
        let rowDate = new Date(record[tableField].value[i].value[saleDateTable].value);
        record[tableField].value[i].value[quarterInTable].value = quarter(rowDate.getMonth() + 1);
    }

    return event;
  });
})();
