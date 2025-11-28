
import React from 'react';
import { createRoot } from "react-dom/client";
import './toolbar.css';
import App from './App';
import { getFormattedDate } from '../../../common/tools';

declare const kintone: any;
declare const RESERVATION_APP_ID: number;
declare const ROOM_LIST_VIEW_ID: number;



kintone.events.on('app.record.index.show', async (e: any) => {
  if (e.viewId === ROOM_LIST_VIEW_ID) {
    // const headerMenu = kintone.app.getHeaderMenuSpaceElement();
    // headerMenu.parentElement.style.display = 'none';
    const headerSpace = kintone.app.getHeaderSpaceElement();
    const container = document.getElementById('root');

    // Create toolbar wrapper div
    const toolbar = document.createElement('div');
    toolbar.className = 'toolbar';
    
    // Create date selector wrapper div
    const dateSelector = document.createElement('div');
    dateSelector.className = 'date-selector';

    // insert text (wrapped in date selector)
    const targetDateTextElement = document.createElement('label');
    targetDateTextElement.innerText = '対象日:';
    targetDateTextElement.id = 'target-text';
    dateSelector.appendChild(targetDateTextElement);

    // insert specifiedDate
    const specifiedDateElement = document.getElementById('date-id');
    if (!specifiedDateElement) {
      const specifiedDate = document.createElement('input');
      specifiedDate.type = 'date';
      specifiedDate.id = 'date-id';
      specifiedDate.className = 'date-input';
      specifiedDate.value = getFormattedDate(new Date());
      specifiedDate.required = true;
      
      specifiedDate.addEventListener('change', (event: any) => {
        const container = document.getElementById('root');
        if (!container) {
          e.error = 'Container element not found';
        }

        const root = createRoot(container!);
        root.render(<App date={event.target.value} />);
      })
      dateSelector.appendChild(specifiedDate);
    }
    
    // Append date selector to toolbar
    toolbar.appendChild(dateSelector);

    // insert createReservationButton
    const redirectReservationButtonElement = document.getElementById('reservation-id');
    if (!redirectReservationButtonElement) {
      const redirectReservationButton = document.createElement('button');
      redirectReservationButton.id = 'reservation-id';
      redirectReservationButton.className = 'btn btn-success';
      redirectReservationButton.innerText = '予約登録';
      redirectReservationButton.type = 'button';
      
      redirectReservationButton.addEventListener('click', () => {
        window.open(`/k/${RESERVATION_APP_ID}/edit`, '_self')
      })
      toolbar.appendChild(redirectReservationButton);
    }

    // insert printButton
    const printElement = document.getElementById("print-button");
    if (!printElement) {
      const print = document.createElement('button');
      print.id = 'print-button';
      print.className = 'btn btn-secondary';
      print.innerText = '印刷';
      print.type = 'button';
      
      print.addEventListener('click', () => {
        window.print();
      })
      toolbar.appendChild(print);
    }

    // Append toolbar to header space
    headerSpace.appendChild(toolbar);

    if (!container) {
      e.error = 'Container element not found';
    }

    const root = createRoot(container!);
    root.render(<App date={getFormattedDate(new Date())} />);
  }
  return e
})
