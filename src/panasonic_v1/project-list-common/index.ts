import {
    financialYear,
    quarter,
    disableField,
    disableFields,
    PSI,
} from './constant';


declare const kintone: any;

(function () {
  ('use strict');


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
    return event;
  });


  const successEvents: string[] = [
    'app.record.create.submit.success',
    'app.record.edit.submit.success',
    'app.record.index.edit.submit.success',
    'mobile.app.record.create.submit.success',
    'mobile.app.record.edit.submit.success',
  ]

  kintone.events.on(successEvents, function (event) {
    let record = event.record;
    if (!record) return event;
    let date = new Date(record.sale_date.value);
    record.financial_year.value = financialYear(date);
    record.quarter.value = quarter(date.getMonth() + 1);
    return event;
  });

})();
