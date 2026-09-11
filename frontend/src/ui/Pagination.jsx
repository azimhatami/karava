import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { toPersianNumbers } from '../utils/toPersianNumbers';

function Pagination({ currentPage, totalPages, setCurrentPage }) {
  if (!totalPages || totalPages < 2) return null;

  const arrow =
    'flex h-9 w-9 items-center justify-center rounded-[9px] border border-ink-line text-ink-muted transition-colors hover:bg-ink-well hover:text-ink-text disabled:pointer-events-none disabled:opacity-40';

  return (
    <nav
      className="flex items-center justify-center gap-2.5 py-2"
      aria-label="صفحه‌بندی"
    >
      {/* RTL: "next" is the left-pointing arrow */}
      <button
        type="button"
        className={arrow}
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="صفحه بعد"
      >
        <IoIosArrowForward className="h-4 w-4" />
      </button>

      <span className="min-w-[104px] text-center text-[13px] text-ink-muted">
        صفحه {toPersianNumbers(currentPage)} از {toPersianNumbers(totalPages)}
      </span>

      <button
        type="button"
        className={arrow}
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="صفحه قبل"
      >
        <IoIosArrowBack className="h-4 w-4" />
      </button>
    </nav>
  );
}

export default Pagination;
