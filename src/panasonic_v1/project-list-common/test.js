

function field_shown(field, status) {
  kintone.app.record.setFieldShown(field, status);
};

const disableField = (record, fields) => {
  for (let field of fields) {
    record[field].disabled = true;
  }
};

const enableField = (record, fields) => {
  for (let field of fields) {
    record[field].disabled = false;
  }
};

function hide_name_field(className, text) {
  const field_name = document.querySelectorAll(`.${className}`);
  field_name.forEach((element) => {
    if (element.textContent == text) {
      (element).style.display = 'none';
    }
  });
};

const quarter = (month) => {
  if (month >= 1 && month <= 3) return 'Q4';
  if (month >= 4 && month <= 6) return 'Q1';
  if (month >= 7 && month <= 9) return 'Q2';
  return 'Q3';
};

const financialYear = (date)  => {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  if (month >= 4) {
    return `FY${year}`;
  } else {
    return `FY${year - 1}`;
  }
};

const PSI = (probability) => {
  if (!probability) return 'LOST';
  const value = parseInt(probability.split('%')[0]);
  if (value >= 50) {
    return 'IN';
  }
  if (value == 10 || value == 30) {
    return 'OUT';
  }
  return 'LOST';
};

const disableFields = [
  'financial_year',
  'quarter',
  'psi',
];




(function () {
  ('use strict');


  const saleDateChangeEvents = [
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
      record.financial_year.value = financialYear(date);
      record.quarter.value = quarter(date.getMonth() + 1);
    } else {
      record.financial_year.value = '';
      record.quarter.value = '';
    }
    return event;
  });

  const probilityChangeEvents = [
    'app.record.create.change.probility',
    'app.record.edit.change.probility',
    'app.record.index.edit.change.probility',
    'mobile.app.record.create.change.probility',
    'mobile.app.record.edit.change.probility',
  ]

  kintone.events.on(probilityChangeEvents, (event) => {
    let record = event.record;
    record.psi.value = PSI(record.probability.value);
    return event;
  });




  
  const showEvents = [
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


  const successEvents = [
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
