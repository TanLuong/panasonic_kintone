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
    'app.record.create.change.sale_date',
    'app.record.edit.change.sale_date',
    'app.record.index.edit.change.sale_date',
    'mobile.app.record.create.change.sale_date',
    'mobile.app.record.edit.change.sale_date',
  ]

  kintone.events.on(saleDateChangeEvents, (event) => {
    let record = event.record;
    if (record.sale_date.value != '') {
      let date = new Date(record.sale_date.value);
      let month = date.toLocaleString('en-US', { month: 'short' });
      record.financial_year.value = financialYear(date);
      record.quarter.value = quarter(date.getMonth() + 1);
      record.exchange_rate.value = exchangeRateDictionary[`${month}${date.getFullYear()}`] || '';
    } else {
      record.financial_year.value = '';
      record.quarter.value = '';
      record.exchange_rate.value = '';
    }
    return event;
  });

  const probilityChangeEvents: string[] = [
    'app.record.create.change.probility',
    'app.record.edit.change.probility',
    'app.record.index.edit.change.probility',
    'mobile.app.record.create.change.probility',
    'mobile.app.record.edit.change.probility',
  ]

  kintone.events.on(probilityChangeEvents, (event) => {
    let record = event.record;
    record.psi.value = PSI(record.probility.value);
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
    if (record.currency.value == 'SGD' && record.sale_date.value) {
      let date = new Date(record.sale_date.value);
      let month = date.toLocaleString('en-US', { month: 'short' });
      record.exchange_rate.value = exchangeRateDictionary[`${month}${date.getFullYear()}`] || '';
      console.log('rate:', record.exchange_rate.value);
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
    record.psi.value = PSI(record.probility.value);
    return event;
  });

  const initShowEvents: string[] = [
    'app.record.create.show',
    'app.record.edit.show',
    'app.record.index.show',
    'mobile.app.record.index.show',
    'mobile.app.record.create.show',
    'mobile.app.record.edit.show',
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
    if (record.sale_date.value != '') {
      let date = new Date(record.sale_date.value);
      let month = date.toLocaleString('en-US', { month: 'short' });
      record.financial_year.value = financialYear(date);
      record.quarter.value = quarter(date.getMonth() + 1);
      record.exchange_rate.value = exchangeRateDictionary[`${month}${date.getFullYear()}`] || '';
      if (!record.unit_price_in_SGD.value && !record.unit_price_in_USD.value) {
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
    let date = new Date(record.sale_date.value);
    let month = date.toLocaleString('en-US', { month: 'short' });
    record.financial_year.value = financialYear(date);
    record.quarter.value = quarter(date.getMonth() + 1);
    record.exchange_rate.value = exchangeRateDictionary[`${month}${date.getFullYear()}`] || '';
    if (!record.exchange_rate.value && record.currency.value === 'SGD') {
      return Swal.fire({
        icon: 'warning',
        title: 'Missing Exchange Rate',
        text: `USD Total Price will be 0.00 USD.`,
      }).then((result) => {
        return event;
      });
    }
    return event;
  });

})();
