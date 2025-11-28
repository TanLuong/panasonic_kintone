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
    'app.record.create.change.sale_date',
    'app.record.edit.change.sale_date',
    'app.record.index.edit.change.sale_date',
  ]

  kintone.events.on(saleDateChangeEvents, (event) => {
    let record = event.record;
    let date = new Date(record.sale_date.value);
    let month = date.toLocaleString('default', { month: 'short' });
    record.financial_year.value = financialYear(date);
    record.quarter.value = quarter(date.getMonth() + 1);
    record.exchange_rate.value = exchangeRateDictionary[`${month}${date.getFullYear()}`] || '';
    return event;
  });

  const probilityChangeEvents: string[] = [
    'app.record.create.change.probility',
    'app.record.edit.change.probility',
    'app.record.index.edit.change.probility',
  ]

  kintone.events.on(probilityChangeEvents, (event) => {
    let record = event.record;
    record.psi.value = PSI(record.probability.value);
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
    if (record.Region.value == 'Singapore' && record.sale_date.value) {
      let date = new Date(record.sale_date.value);
      let month = date.toLocaleString('default', { month: 'short' });
      record.exchange_rate.value = exchangeRateDictionary[`${month}${date.getFullYear()}`] || '';
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
    record.psi.value = PSI(record.probability.value);
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
    let date = new Date(record.sale_date.value);
    let month = date.toLocaleString('default', { month: 'short' });
    record.financial_year.value = financialYear(date);
    record.quarter.value = quarter(date.getMonth() + 1);
    record.exchange_rate.value = exchangeRateDictionary[`${month}${date.getFullYear()}`] || '';
    if (!record.exchange_rate.value && record.Region.value === 'Singapore') {
      event.error = 'Exchange Rate is required';
      record.exchange_rate.error = 'Please update record in Exchange Rate app';
    }
    return event;
  });


})();
