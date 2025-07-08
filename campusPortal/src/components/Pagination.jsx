import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalItems, 
  itemsPerPage, 
  onPageChange,
  className = ''
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const indexOfFirst = (currentPage - 1) * itemsPerPage + 1;
  const indexOfLast = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (pageNum) => {
    onPageChange(pageNum);
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`flex flex-col md:flex-row items-center justify-between ${className}`}>
      <div className="text-sm text-gray-700 mb-4 md:mb-0">
        Showing <span className="font-medium">{indexOfFirst}</span> to{' '}
        <span className="font-medium">{indexOfLast}</span> of{' '}
        <span className="font-medium">{totalItems}</span> items
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }
          return (
            <button
              key={pageNum}
              onClick={() => handlePageClick(pageNum)}
              className={`w-10 h-10 rounded-lg text-sm font-medium ${
                currentPage === pageNum
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                  : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
              aria-label={`Page ${pageNum}`}
            >
              {pageNum}
            </button>
          );
        })}
        
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;