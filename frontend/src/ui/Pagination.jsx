import { useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";


function Pagination({ currentPage, totalPages, setCurrentPage }) {

  const handlePageChange = (page) => {
    setCurrentPage(page)
  };

  return(
    <div className=''>
      <div className='flex flex-row items-center justify-center mt-12'>
        <button
          className='font-bold rounded-lg cursor-pointer'
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <IoIosArrowForward className='w-6 h-6 hover:text-primary-900 text-secondary-900'/>          
        </button>
        <span className='mx-4 text-secondary-800'>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className='font-bold rounded-lg cursor-pointer'
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <IoIosArrowBack className='w-6 h-6 hover:text-primary-900 text-secondary-900'/>
        </button>
      </div>
    </div>
  )
}


export default Pagination
