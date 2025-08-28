export declare const kintone: any;

interface KintoneRecord {
  [key: string]: {
    value: string;
    disabled?: boolean;
  };
}

interface ExchangeRateRecord {
  rate: { value: string };
  year: { value: string };
  month: { value: string };
}

interface ExchangeRateMap {
  [key: string]: string;
}

export const ExchangeAppId: number = 7;

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

export const PSI = (probility: string): string => {
  if (!probility) return 'LOST';
  const value = parseInt(probility.split('%')[0]);
  if (value >= 50) {
    return 'IN';
  }
  if (value == 10 || value == 30) {
    return 'OUT';
  }
  return 'LOST';
}

export const disableFields: string[] = [
  'Drop_down_2',
  'Drop_down_3',
  'Drop_down_4',
  'EXCHANGERATE',
]

export const currencyUSDFields: string[] = [
  'USDUNITPRICE',
]

export const currencySGDFileds: string[] = [
  'SGDUNITPRICE',
  'EXCHANGERATE',
]

export const disableCurrencyField = (record: KintoneRecord): void => {
  if (record.Region.value != 'Singapore') {
    disableField(record, ['currency']);
    record.currency.value = 'USD';
  } else {
    enableField(record, ['currency']);
  }
}

export const disableConditionFields = (record: KintoneRecord): void => {
  if (record.currency.value != 'SGD') {
    disableField(record, currencySGDFileds);
    currencySGDFileds.forEach(field => {
      field_shown(field, false);
    });
    record.SGDUNITPRICE.value = '';
    enableField(record, currencyUSDFields);
    currencyUSDFields.forEach(field => {
      field_shown(field, true);
    });
  } else {
    enableField(record, ['SGDUNITPRICE']);
    currencySGDFileds.forEach(field => {
      field_shown(field, true);
    });
    record.USDUNITPRICE.value = '';
    disableField(record, currencyUSDFields);
    currencyUSDFields.forEach(field => {
      field_shown(field, false);
    });
  }
}

export const getExchangeRate = (): Promise<ExchangeRateMap> => {
  const date = new Date();
  const year = date.getFullYear();
  const body = {
    app: ExchangeAppId,
    query: `year > "${year - 1}"`,
    fields: ['rate', 'year', 'month'],
  }
  return kintone.api(kintone.api.url('/k/v1/records.json', true), 'GET', body)
    .then(function (resp: { records: ExchangeRateRecord[] }): ExchangeRateMap {
      if (resp.records.length === 0) {
        return {}; // No exchange rate found for the specified date
      }
      const records = resp.records;
      return records.reduce((acc: ExchangeRateMap, record: ExchangeRateRecord) => {
        const key = `${record.month.value}${record.year.value}`;
        acc[key] = record.rate.value;
        return acc;
      }, {});
    })
    .catch(function (error: any): ExchangeRateMap {
      console.error('Error fetching exchange rate:', error);
      return {}; // Error fetching exchange rate
    });
}
