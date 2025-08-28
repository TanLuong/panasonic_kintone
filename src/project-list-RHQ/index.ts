import {
    financialYear,
    quarter,
    disableField,
    disableConditionFields,
    disableFields,
    PSI,
    getExchangeRate,
    disableCurrencyField,
} from './constant';

import Swal from 'sweetalert2';

declare const kintone: any;

(function () {
  ('use strict');

  let exchangeRateDictionary = {};

  const saleDateChangeEvents: string[] = [
    'app.record.create.change.SALES_DATE',
    'app.record.edit.change.SALES_DATE',
    'app.record.index.edit.change.SALES_DATE',
    'mobile.app.record.create.change.SALES_DATE',
    'mobile.app.record.edit.change.SALES_DATE',
  ]

  kintone.events.on(saleDateChangeEvents, (event) => {
    let record = event.record;
    if (record.SALES_DATE.value != '') {
      let date = new Date(record.SALES_DATE.value);
      let month = date.toLocaleString('default', { month: 'short' });
      record.Drop_down_2.value = financialYear(date);
      record.Drop_down_3.value = quarter(date.getMonth() + 1);
      record.EXCHANGERATE.value = exchangeRateDictionary[`${month}${date.getFullYear()}`] || '';
    } else {
      record.Drop_down_2.value = '';
      record.Drop_down_3.value = '';
      record.EXCHANGERATE.value = '';
    }
    return event;
  });

  const probilityChangeEvents: string[] = [
    'app.record.create.change.Drop_down_1',
    'app.record.edit.change.Drop_down_1',
    'app.record.index.edit.change.Drop_down_1',
    'mobile.app.record.create.change.Drop_down_1',
    'mobile.app.record.edit.change.Drop_down_1',
  ]

  kintone.events.on(probilityChangeEvents, (event) => {
    let record = event.record;
    record.Drop_down_4.value = PSI(record.Drop_down_1.value);
    return event;
  });

  const currencyChangeEvents: string[] = [
    'app.record.create.change.currency',
    'app.record.edit.change.currency',
    'app.record.index.edit.change.currency',
    'mobile.app.record.create.change.currency',
    'mobile.app.record.edit.change.currency',
  ]
    kintone.events.on(currencyChangeEvents, (event) => {
    let record = event.record;
    disableConditionFields(record);
    if (record.currency.value == 'SGD' && record.SALES_DATE.value) {
      let date = new Date(record.SALES_DATE.value);
      let month = date.toLocaleString('default', { month: 'short' });
      record.EXCHANGERATE.value = exchangeRateDictionary[`${month}${date.getFullYear()}`] || '';
    }
    return event;
  });

  const regionChangeEvents: string[] = [
    'app.record.create.change.Region',
    'app.record.edit.change.Region',
    'app.record.index.edit.change.Region',
    'mobile.app.record.create.change.Region',
    'mobile.app.record.edit.change.Region',
  ]
    kintone.events.on(regionChangeEvents, (event) => {
    let record = event.record;
    disableCurrencyField(record);
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
    disableConditionFields(record);
    disableCurrencyField(record);
    record.Drop_down_4.value = PSI(record.Drop_down_1.value);
    return event;
  });

  const initShowEvents: string[] = [
    'app.record.create.show',
    'app.record.edit.show',
    'app.record.index.show',
    'mobile.app.record.index.show',
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
    'mobile.app.record.create.submit',
    'mobile.app.record.edit.submit',
  ]

  kintone.events.on(submitEvents, function (event) {
    let record = event.record;
    if (record.SALES_DATE.value != '') {
      let date = new Date(record.SALES_DATE.value);
      let month = date.toLocaleString('default', { month: 'short' });
      record.Drop_down_2.value = financialYear(date);
      record.Drop_down_3.value = quarter(date.getMonth() + 1);
      record.EXCHANGERATE.value = exchangeRateDictionary[`${month}${date.getFullYear()}`] || '';
      if (!record.SGDUNITPRICE.value && !record.USDUNITPRICE.value) {
        event.error = 'Unit Price is required, please enter value for one of currency';
      }
    }
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
    let date = new Date(record.SALES_DATE.value);
    let month = date.toLocaleString('default', { month: 'short' });
    record.Drop_down_2.value = financialYear(date);
    record.Drop_down_3.value = quarter(date.getMonth() + 1);
    record.EXCHANGERATE.value = exchangeRateDictionary[`${month}${date.getFullYear()}`] || '';
    if (!record.EXCHANGERATE.value && record.currency.value === 'SGD') {
      return Swal.fire({
        icon: 'warning',
        title: 'Missing Exchange Rate',
        text: `Total price will be 0.`,
      }).then((result) => {
        return event;
      });
    }
    return event;
  });

})();
