"use client";
import React from "react";
import ReactPaginate from "react-paginate";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePageClick = (event: { selected: number }) => {
    onPageChange(event.selected + 1);
  };

  return (
    <div className="flex items-center justify-end py-4">
      <ReactPaginate
        breakLabel="..."
        nextLabel={<ChevronRight className="h-4 w-4" />}
        previousLabel={<ChevronLeft className="h-4 w-4" />}
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        pageCount={totalPages}
        forcePage={currentPage - 1}
        containerClassName="flex items-center space-x-2"
        pageClassName="rounded-md hover:bg-gray-100 hover:text-gray-900"
        pageLinkClassName="px-3 py-1 text-sm hover:text-gray-900 w-full h-full flex items-center justify-center"
        activeClassName="bg-primary text-primary-foreground   hover:text-gray-900"
        activeLinkClassName=""
        previousClassName="px-2 py-1 rounded-md hover:bg-gray-100 hover:text-gray-900"
        nextClassName="px-2 py-1 rounded-md hover:bg-gray-100 hover:text-gray-900"
        breakClassName="px-2 hover:text-gray-900"
        disabledClassName="opacity-50 cursor-not-allowed"
      />
    </div>
  );
};

export default Pagination;