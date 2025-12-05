import { object } from "zod";

declare const kintone: any;

const postCursor = async (_params: {
    app: number | undefined,
    filterCond?: string,
    sortConds?: string[],
    fields: string[],
}) => {
  var MAX_READ_LIMIT = 500;

  var params = _params || {};
  var app = params.app || kintone.app.getId();
  var filterCond = params.filterCond;
  var sortConds = params.sortConds;
  var fields = params.fields;

  var conditions = [];
  if (filterCond) {
    conditions.push(filterCond);
  }

  var sortCondsAndLimit =
    (sortConds && sortConds.length > 0 ? ' order by ' + sortConds.join(', ') : '');
  var query = conditions.join(' and ') + sortCondsAndLimit;
  var body: {
    app: number,
    query: string,
    size: number,
    fields?: string[],
  } = {
    app: app,
    query: query,
    size: MAX_READ_LIMIT
  };
  if (fields && fields.length > 0) {
    body.fields = fields;
  }

  const response = await kintone.api(kintone.api.url('/k/v1/records/cursor.json', true), 'POST', body)
  return response.id
};

// Retrieve records from the cursor using Get Cursor API
const getRecordsByCursorId = async (_params: {
    id: number,
    data?: {
        records: object[]
    },
}): Promise<{ records: object[]  } | undefined> => {
  var params = _params || {};
  var id = params.id;

  var data = params.data;

  if (!data) {
    data = {
      records: []
    };
  }

  var body = {
    id: id
  };
  const response = await kintone.api(kintone.api.url('/k/v1/records/cursor.json', true), 'GET', body)
  data.records = data.records.concat(response.records)
  if (response.next) {
    data = await getRecordsByCursorId({ id, data })
  }
  return data
};

/*
  * @param {Object} params
  *   - app {String}: APP ID (Default value is current app id)
  *   - filterCond {String}: Query condition
  *   - sortConds {Array}: Sorting conditions
  *   - fields {Array}: Fields to retrieve
  * @return {Object} response
  *   - records {Array}: Target records
  */
export const getRecords = async (_params: {
    app: number | undefined,
    filterCond?: string,
    sortConds?: string[],
    fields: string[],
}): Promise<{ records: object[]  } | undefined> => {
  const cursorId = await postCursor(_params)
  return getRecordsByCursorId({id: cursorId})
};

export const paginateRecords = (records: object[], pageSize: number, pageNumber: number) => {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return records.slice(startIndex, endIndex);
}

export const calculateTotalPages = (totalRecords: number, pageSize: number) => {
    return Math.ceil(totalRecords / pageSize);
}

export const getOptionsOfField = async (appId: number, fieldCode: string) => {
    const body = {
        app: appId,
    };
    const response = await kintone.api(kintone.api.url('/k/v1/app/form/fields', true), 'GET', body)
    const fieldOptions = response['properties'][fieldCode]['options'];
    const optionList = Object.keys(fieldOptions).map(key => fieldOptions[key] );
    optionList.sort((a, b) => a['index'] - b['index'])
    return optionList.map(items => items['label'])
}

export const createDatalist = (data: string[], field: string) => {
    const dataList = document.createElement('datalist');
    dataList.id = 'datalist-' + field;
    data.forEach((item: any) => {
        const option = document.createElement('option');
        option.value = item;
        dataList.appendChild(option);
    });
    document.body.appendChild(dataList);
}

export const getFormattedDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


export const getDifferentDate = (date1: string, date2: string) => {
  const date2Object = new Date(date2);
  const date1Object = new Date(date1);
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  return (date2Object.getTime() - date1Object.getTime()) / millisecondsPerDay
}

export const greaterDate = (date1: string, date2: string) => {
  const date1Object = new Date(date1);
  const date2Object = new Date(date2);
  return date1Object > date2Object;
}
