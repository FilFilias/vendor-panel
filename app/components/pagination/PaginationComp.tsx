
import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router';

interface StandalonePaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  hasParams?: boolean;
  className?: string;
}

export function PaginationComp({ 
  currentPage, 
  totalPages, 
  baseUrl,
  className = "",
  hasParams=false
}: StandalonePaginationProps) {
  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    if (hasParams) {
      return baseUrl + '&page=' + page
    }
    return baseUrl + '?page=' + page
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    // Calculate the range of pages to show around current page
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    // Add first page and dots if needed
    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    // Add the calculated range
    rangeWithDots.push(...range);

    // Add last page and dots if needed
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav className={`pt-12 flex items-center justify-center space-x-2 ${className}`}>
      {/* Previous Button */}
      {currentPage > 1 &&
        <Link
          to={createPageUrl(currentPage - 1)}
          className="h-full flex items-center justify-center p-[7px] text-sm font-medium bg-white dark:text-white dark:bg-gray-800 dark:text-white dark:hover:text-orange hover:text-white hover:bg-orange transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
      }

      {/* Page Numbers */}
      <div className="flex items-center space-x-2">
        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="flex items-center justify-center px-3 py-2 text-sm font-medium">
                <MoreHorizontal className="w-4 h-4" />
              </span>
            ) : (
              <Link
                to={createPageUrl(page as number)}
                className={`flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentPage === page
                    ? 'bg-primary text-white border border-primary dark:bg-orange dark:border-orange'
                    : 'text-main bg-white border border-main hover:bg-orange hover:border-orange hover:text-white dark:bg-gray-800 dark:text-white dark:hover:bg-orange'
                }`}
              >
                {page}
              </Link>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next Button */}
        {currentPage < totalPages &&
            <Link
            to={createPageUrl(currentPage + 1)}
            className="h-full flex items-center justify-center p-[7px] text-sm font-medium bg-white dark:bg-gray-800 dark:text-white dark:hover:text-orange hover:text-white hover:bg-orange transition-colors"
            >
            <ChevronRight className="w-6 h-6" />
            </Link>
        }
    </nav>
  );
}
