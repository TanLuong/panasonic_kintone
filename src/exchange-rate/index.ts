import Swal from "sweetalert2";
export const PROJECT_LIST_APP_ID = 9;


declare const kintone: any;

const durationDateOfMonth = (month: number, year: number): number => {
  return new Date(year, month, 0).getDate();
}

(function () {
  ('use strict');


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
    let sale_month = `${record.month.value}, ${record.year.value}`;
    let body = {
      app: PROJECT_LIST_APP_ID,
      query: `sale_month = "${sale_month}" and currency in ("SGD")`,
      fields: ['$id']
    };
    return kintone.api(kintone.api.url('/k/v1/records', true), 'GET', body).then(function (resp: any) {
      if (resp.records.length === 0) {
        return Swal.fire({
          icon: 'info',
          title: 'Update exchange rate at project list app',
          text: 'No record updated.',
        }).then(() => {
          return event;
        });
      }
      
      const maxUpdate = 100;
      const recordUpdate = Array.from({ length: Math.ceil(resp.records.length / maxUpdate) }, (_, i) => resp.records.slice(i * maxUpdate, i * maxUpdate + maxUpdate));
      const requestUpdate = recordUpdate.map(async (records: any) => {
        let updateBody = {  
          app: PROJECT_LIST_APP_ID,
          records: records.map((r: any) => {
            return {
              id: r.$id.value,
              record: {
                exchange_rate: {
                  value: record.rate.value
                }
              }
            }
          })
        };
        return await kintone.api(kintone.api.url('/k/v1/records', true), 'PUT', updateBody);
      });
      console.log(requestUpdate);
      return Promise.all(requestUpdate).then((updateResp) => {
        let totalUpdated = updateResp.reduce((acc, curr) => acc + curr.records.length, 0);
        if (totalUpdated === resp.records.length) {
          return Swal.fire({
            icon: 'success',
            title: 'Update exchange rate at project list app',
            text: `${totalUpdated} record(s) updated.`,
          }).then(() => {
            return event;
          });
        }
        return Swal.fire({
          icon: 'error',
          title: 'Update exchange rate at project list app',
          text: `Total records are ${resp.records.length} record(s) in ${record.month.value}-${record.year.value}, \nbut ${totalUpdated} record(s) updated. \nPlease try again.`,
        }).then(() => {
          return event;
        });
      })  
    }).catch((err) => {
        return Swal.fire({
          icon: 'error',
          title: 'Update exchange rate at project list app',
          text: `Update record fail. \nPlease contract administrator.`,
        }).then(() => {
          return event;
        });
      });  
  });

})();
