import { createRoot } from 'react-dom/client';
import RoomGrid from './react/RoomGrid';

declare const kintone: any

const indexShow = [
        'app.record.index.show',
    ]


kintone.events.on(indexShow, (e: any) => {
    console.log('aaaaa')
    const contentElement = document.getElementById('root');
    const root = createRoot(contentElement || document.createElement('div'));
    root.render(<RoomGrid/>)
    contentElement?.appendChild(contentElement)
    return e
})
