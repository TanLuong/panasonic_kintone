import { useState } from "react";
import React from "react";
import "./RoomCard.css";

interface FooterRoomProps {
    totalRooms: number;
    pageNumber: number;
    totalPages: number;
    roomInPage: number;
}

const FooterRoom: React.FC<FooterRoomProps> = ({
    totalRooms,
    pageNumber,
    totalPages,
    roomInPage,
}) => {
    const [currentPage, setCurrentPage] = useState(1);

    return (
        <div className="page-info">
            {totalRooms === 0 ? (<>
                <div className="footer-room-item">0件</div>
            </>
            ) : (<>
                <div className="footer-room-item">{(pageNumber - 1) * roomInPage + 1}件/全{totalRooms}件</div>
                <div className="footer-room-item">
                    <button className={pageNumber === 1? "disabled-button":"enabled"}>&lt;</button>
                </div>
            </>
            )}
            
        </div>
    );
}
