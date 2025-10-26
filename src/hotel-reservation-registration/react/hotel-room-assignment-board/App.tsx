import React, { useState, useEffect } from 'react';
import './App.css';
import { Room } from './types';
import { fetchHotelData } from './api';
import RoomCard from './components/RoomCard';
import Pagination from '../../../components/Pagination';
import Summary from './components/Summary';

const ITEMS_PER_PAGE = 8;
// TODO: Please replace with your actual Kintone App IDs
declare const ROOM_LIST_APP_ID: number;
declare const kintone: any;

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const RESERVATION_APP_ID = kintone.app.getId()
        const fetchedRooms = await fetchHotelData(RESERVATION_APP_ID, ROOM_LIST_APP_ID);
        setRooms(fetchedRooms);
      } catch (err) {
        setError('Failed to fetch room data. Please ensure the Kintone SDK is available and App IDs are correct.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // Empty dependency array ensures this runs only once on mount

  const totalPages = Math.ceil(rooms.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRooms = rooms.slice(startIndex, endIndex);

  return (
    <div className="app-root">
      <header className="app-header">
        部屋割り表アプリ
      </header>

      <main className="app-main">
        {loading ? (
          <div className="loading">Loading room data...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <>
            <Summary rooms={rooms} />
            <div className="content-wrapper">
              <div className="rooms-grid">
                {currentRooms.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      {!loading && !error && rooms.length > 0 && (
        <footer className="app-footer">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={rooms.length}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </footer>
      )}
    </div>
  );
};

export default App;
