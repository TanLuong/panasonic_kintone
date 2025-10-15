import Swal from "sweetalert2";

import { quarter, PSI, disableField, financialYear } from './function';

declare const kintone: any
declare const EXCHANGE_APP_ID: number
interface ExchangeRateRecord {
  rate: { value: string };
  year: { value: string };
  month: { value: string };
}

interface ExchangeRateMap {
  [key: string]: string;
}

(() => {
  ('use strict');

  // set up field name
  const probability = 'probability';
  const region = 'region';
  const tableField = 'table';
  const quarterInTable = 'quarter_t';
  const noInTable = 'No_t';
  const saleMonthTable = 'sale_month_year_t';
  const saleDateTable = 'sale_date_t';
  const SGDPrice = 'sgd_price_t';
  const USDPrice = 'usd_price_t';
  const exchangeRateInTable = 'exchange_rate_t';
  const currencyInTable = 'currency_t';
  const financialYearInTable = 'financial_year_t'


  const disbleTableFields: string[] = [
    quarterInTable,
    noInTable,
    saleMonthTable,
    exchangeRateInTable,
    currencyInTable,
    financialYearInTable
  ]

  const disableFields: string[] = [
    // 'financial_year',
    // 'quarter',
    'psi',
  ]

  const saleDateChangeEvents: string[] = [
    `app.record.create.change.${saleDateTable}`,
    `app.record.edit.change.${saleDateTable}`,
    `app.record.index.edit.change.${saleDateTable}`,
  ];

  kintone.events.on(saleDateChangeEvents, (event: any) => {
    let record = event.record;

    // Update quarter belong sale date
    let numberRow = record[tableField].value.length;
    for (let i = 0; i < numberRow; i++) {
      let saleDate = new Date(record[tableField].value[i].value[saleDateTable].value)
      record[tableField].value[i].value[quarterInTable].value = quarter(saleDate.getMonth() + 1);
      record[tableField].value[i].value[financialYearInTable].value = financialYear(saleDate)
    }
    return event;
  });

  const probilityChangeEvents: string[] = [
    `app.record.create.change.${probability}`,
    `app.record.edit.change.${probability}`,
    `app.record.index.edit.change.${probability}`,
  ]

  kintone.events.on(probilityChangeEvents, (event: any) => {
    let record = event.record;
    record.psi.value = PSI(record.probability.value);
    return event;
  });

  const regionChangeEvents: string[] = [
    `app.record.create.change.${region}`,
    `app.record.edit.change.${region}`,
    `app.record.index.edit.change.${region}`,
  ]
  kintone.events.on(regionChangeEvents, (event: any) => {
    let record = event.record;

    // Disable table fields and set up value in table
    let numberRow = record[tableField].value.length;
    for (let i = 0; i < numberRow; i++) {
      if (record[region].value == "Singapore") {
        record[tableField].value[i].value[currencyInTable].value = "SGD"
        record[tableField].value[i].value[USDPrice].disabled = true
        record[tableField].value[i].value[SGDPrice].disabled = false
      }
      else {
        record[tableField].value[i].value[currencyInTable].value = "USD"
        record[tableField].value[i].value[USDPrice].disabled = false
        record[tableField].value[i].value[SGDPrice].disabled = true
      }
    }

    return event;
  });


  // initial edit show
  const showEvents: string[] = [
    'app.record.create.show',
    'app.record.edit.show',
    'app.record.index.edit.show',
    'app.record.detail.show',
    `app.record.edit.change.${tableField}`,
    `app.record.create.change.${tableField}`,
    `app.record.index.edit.change.${tableField}`,
  ]

  kintone.events.on(showEvents, function (event: any) {
    var record = event.record;
    disableField(record, disableFields);
    record.psi.value = PSI(record.probability.value);

    // Disable table fields and set up value in table
    let numberRow = record[tableField].value.length;
    for (let i = 0; i < numberRow; i++) {
      disbleTableFields.forEach(e => record[tableField].value[i].value[e].disabled = true)
      let rowDate = new Date(record[tableField].value[i].value[saleDateTable].value);
      record[tableField].value[i].value[quarterInTable].value = quarter(rowDate.getMonth() + 1);
      record[tableField].value[i].value[financialYearInTable].value = financialYear(rowDate);

      if (record[region].value == "Singapore") {
        record[tableField].value[i].value[currencyInTable].value = "SGD"
        record[tableField].value[i].value[USDPrice].disabled = true
        record[tableField].value[i].value[SGDPrice].disabled = false
      }
      else {
        record[tableField].value[i].value[currencyInTable].value = "USD"
        record[tableField].value[i].value[USDPrice].disabled = false
        record[tableField].value[i].value[SGDPrice].disabled = true
        record[tableField].value[i].value[exchangeRateInTable].value = 0
      }
    }
    return event;
  });


  const submitEvents: string[] = [
    'app.record.create.submit',
    'app.record.edit.submit',
    'app.record.index.edit.submit',
  ]

  kintone.events.on(submitEvents, function (event: any) {
    let record = event.record;
    // autofill in table
    let numberRow = record[tableField].value.length;
    let query = [];
    for (let i = 0; i < numberRow; i++) {
      // fill No
      record[tableField].value[i].value[noInTable].value = i + 1;
      // fill quarter
      let rowDate = new Date(record[tableField].value[i].value[saleDateTable].value);
      record[tableField].value[i].value[quarterInTable].value = quarter(rowDate.getMonth() + 1);
      record[tableField].value[i].value[financialYearInTable].value = financialYear(rowDate);

      // create query
      let month = rowDate.toLocaleString('en-US', { month: 'short' });
      let year = rowDate.getFullYear();
      query.push(`(year = "${year}" and month in ("${month}"))`)
    }

    if (query.length === 0) return event
    const body = {
      app: EXCHANGE_APP_ID,
      query: query.join(' or '),
      fields: ['rate', 'year', 'month'],
    }
    return kintone.api(kintone.api.url('/k/v1/records.json', true), 'GET', body)
      .then(function (resp: { records: ExchangeRateRecord[] }) {
        if (resp.records.length === 0) {
          return {}; // No exchange rate found for the specified date
        }
        const records = resp.records;
        const exchangeRate = records.reduce((acc: ExchangeRateMap, rec: ExchangeRateRecord) => {
          const key = `${rec.month.value}${rec.year.value}`;
          acc[key] = rec.rate.value;
          return acc;
        }, {});

        // update Exchange Rate
        for (let i = 0; i < numberRow; i++) {
          let rowDate = new Date(record[tableField].value[i].value[saleDateTable].value);
          let month = rowDate.toLocaleString('en-US', { month: 'short' });
          let year = rowDate.getFullYear();
          record[tableField].value[i].value[exchangeRateInTable].value = exchangeRate[`${month}${year}`]
        }
        return event;
      })
      .catch(function (error: any) {
        console.error('Error fetching exchange rate:', error);
        return {}; // Error fetching exchange rate
      });
  });

    const submitSuccessEvents: string[] = [
    'app.record.create.submit.success',
    'app.record.edit.submit.success',
    'app.record.index.edit.submit.success',
  ]

  kintone.events.on(submitSuccessEvents, function (event: any) {
    let record = event.record;

    // notification if exchange rate empty
    let messages: string[] = []
    let numberRow = record[tableField].value.length;
    for (let i = 0; i < numberRow; i++) {
      if (
        record[tableField].value[i].value[currencyInTable].value != "USD" && 
        record[tableField].value[i].value[exchangeRateInTable].value == 0
      ) {
          let rowDate = new Date(record[tableField].value[i].value[saleDateTable].value);
          let month = rowDate.toLocaleString('en-US', { month: 'short' });
          let year = rowDate.getFullYear();
          messages.push(`${month}-${year}`)
      }
    }
    if (messages.length > 0) {
      Swal.fire({
        title: 'Exchange Rate is empty',
        text: `Please set exchange rate for months: ${messages.join(', ')}.`,
        icon: 'warning'
      })
    }
    return event;
  });
})();
