




declare const kintone: any;
declare const WebDataRocks: any;

(function () {
  ('use strict');


  const successEvents: string[] = [
    'app.record.index.show',
  ]

  kintone.events.on(successEvents, function (event) {
    const body = {
      app: event.records[0].app_id.value
    }
    let records = event.records;
    return kintone.api(kintone.api.url('/k/v1/records.json', true), 'GET', body).then(function (resp: any) {
      const data = resp.records.map((record: any) => {
        return {
          probility: record?.probility?.value || '',
          region: record.Region.value,
          sale_date: record.sale_date.value,
          ficas_year: record.financial_year.value,
          psi: record.psi.value,
          product_type: record.product_type.value,
          model_name: record.Lookup_0.value,
          USD: record?.total_USD?.value ? parseFloat(record.total_USD.value) : 0,
        }
      });
      const pivot = new WebDataRocks({
        container: "#root",
        toolbar: true,
        report: {
          dataSource: {
            data: data
          }
        }
      });
      console.log(pivot);
      return event;
    }); 
  });
})();
