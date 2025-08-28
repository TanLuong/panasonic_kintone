import {
    financialYear,
    quarter,
    disableField,
    disableConditionFields,
    disableFields,
    PSI,
    getExchangeRate,
} from './project-list-RHQ/constant';

declare const kintone: any;

export const event: any = (function () {
  ('use strict');

  let exchangeRateDictionary = {};

  const saleDateChangeEvents: string[] = [
    'app.record.create.change.SALES_DATE',
    'app.record.edit.change.SALES_DATE',
    'app.record.index.edit.change.SALES_DATE',
  ]

  kintone.events.on(saleDateChangeEvents, (event) => {
    let record = event.record;
    let date = new Date(record.SALES_DATE.value);
    let month = date.toLocaleString('default', { month: 'short' });
    record.Drop_down_2.value = financialYear(date);
    record.Drop_down_3.value = quarter(date.getMonth() + 1);
    record.EXCHANGERATE.value = exchangeRateDictionary[`${month}${date.getFullYear()}`] || '';
    return event;
  });

  const probilityChangeEvents: string[] = [
    'app.record.create.change.Drop_down_1',
    'app.record.edit.change.Drop_down_1',
    'app.record.index.edit.change.Drop_down_1',
  ]

  kintone.events.on(probilityChangeEvents, (event) => {
    let record = event.record;
    record.Drop_down_4.value = PSI(record.Drop_down_1.value);
    return event;
  });

  const regionChangeEvents: string[] = [
    'app.record.create.change.Region',
    'app.record.edit.change.Region',
    'app.record.index.edit.change.Region',
  ]
    kintone.events.on(regionChangeEvents, (event) => {
    let record = event.record;
    disableConditionFields(record);
    if (record.Region.value == 'Singapore' && record.SALES_DATE.value) {
      let date = new Date(record.SALES_DATE.value);
      let month = date.toLocaleString('default', { month: 'short' });
      record.EXCHANGERATE.value = exchangeRateDictionary[`${month}${date.getFullYear()}`] || '';
    }
    return event;
  });
  
  const showEvents: string[] = [
    'app.record.create.show',
    'app.record.edit.show',
    'app.record.index.edit.show',
    'app.record.detail.show',
  ]

  kintone.events.on(showEvents, function (event) {
    var record = event.record;
    disableField(record, disableFields);
    disableConditionFields(record);
    record.Drop_down_4.value = PSI(record.Drop_down_1.value);
    return event;
  });

  const initShowEvents: string[] = [
    'app.record.create.show',
    'app.record.edit.show',
    'app.record.index.show',
  ]

  kintone.events.on(initShowEvents, function (event) {
    return getExchangeRate()
      .then((exchangeRate) => {
        exchangeRateDictionary = exchangeRate;
        return event;
      });
  });

  const submitEvents: string[] = [
    'app.record.create.submit',
    'app.record.edit.submit',
    'app.record.index.edit.submit',
  ]

  kintone.events.on(submitEvents, function (event) {
    let record = event.record;
    let date = new Date(record.SALES_DATE.value);
    let month = date.toLocaleString('default', { month: 'short' });
    record.Drop_down_2.value = financialYear(date);
    record.Drop_down_3.value = quarter(date.getMonth() + 1);
    record.EXCHANGERATE.value = exchangeRateDictionary[`${month}${date.getFullYear()}`] || '';
    if (!record.EXCHANGERATE.value && record.Region.value === 'Singapore') {
      event.error = 'Exchange Rate is required';
      record.EXCHANGERATE.error = 'Please update record in Exchange Rate app';
    }
    return event;
  });


})();
