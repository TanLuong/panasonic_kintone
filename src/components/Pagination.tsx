import React from 'react';
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
  const generatePageNumbers = () => {
    const pages = new Set<number>();
    pages.add(1);
    pages.add(totalPages);

    if (currentPage > 1) pages.add(currentPage - 1);
    pages.add(currentPage);
    if (currentPage < totalPages) pages.add(currentPage + 1);
    
    const sortedPages = Array.from(pages).sort((a, b) => a - b);
    
    const result: (number | string)[] = [];
    let lastPage: number | null = null;
    
    for(const page of sortedPages) {
        if(lastPage !== null && page - lastPage > 1) {
            result.push('...');
        }
        result.push(page);
        lastPage = page;
    }
    
    return result;
  };

  const pageItems = generatePageNumbers();
  const firstItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const lastItem = Math.min(currentPage * itemsPerPage, totalItems);

  const PageButton: React.FC<{ page: number | string, isCurrent?: boolean }> = ({ page, isCurrent }) => {
    if (page === '...') {
      return <span className="ellipsis">...</span>;
    }
    const pageNumber = page as number;
    return (
      <button
        onClick={() => onPageChange(pageNumber)}
        className={`page-btn ${isCurrent ? 'current' : ''}`}
        disabled={isCurrent}
        aria-current={isCurrent ? 'page' : undefined}
      >
        {page}
      </button>
    );
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination-root">
      <div className="mobile-actions">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="nav-btn"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="nav-btn ml"
        >
          Next
        </button>
      </div>
      <div className="desktop-actions">
        <div className="pagination-info">
          <p>
            Showing <span className="emphasis">{firstItem}</span> to <span className="emphasis">{lastItem}</span> of{' '}
            <span className="emphasis">{totalItems}</span> results
          </p>
        </div>
        <div className="pagination-nav" aria-label="Pagination">
          <div className="page-controls">
            {pageItems.map((page, index) => (
                <PageButton key={index} page={page} isCurrent={page === currentPage} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
