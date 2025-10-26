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
