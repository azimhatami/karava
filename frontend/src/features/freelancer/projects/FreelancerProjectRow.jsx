import { Link } from 'react-router-dom';
import { HiOutlineEye } from 'react-icons/hi2';
import truncateText from '../../../utils/truncateText';
import shortDate from '../../../utils/shortDate';
import { toPersianNumbersWithComma } from '../../../utils/toPersianNumbers';

const PROJECTS_GRID_COLS =
  'grid-cols-[minmax(0,2.4fr)_1.2fr_1.1fr_1fr_0.8fr]';

const projectStatus = {
  OPEN: {
    label: 'باز',
    className: 'bg-karava-green text-white',
  },
  CLOSED: {
    label: 'بسته',
    className: 'border border-[#F9A8D4] bg-[#FDF2F8] text-[#BE185D]',
  },
  COMPLETED: {
    label: 'تکمیل‌شده',
    className: 'bg-[#E0F2FE] text-[#075985]',
  },
};

function FreelancerProjectRow({ project }) {
  const { status, title, budget, deadline } = project;
  const statusMeta = projectStatus[status] || projectStatus.CLOSED;

  return (
    <div
      className={`box-border grid h-[68px] w-full shrink-0 rotate-0 items-center border-b border-[#000000] px-1 py-[19px] opacity-100 transition-colors hover:bg-[#F2FFF8] ${PROJECTS_GRID_COLS}`}
    >
      <span className="min-w-0 truncate text-center text-sm text-[#374151]">
        {truncateText(title || '', 30)}
      </span>
      <span className="text-center text-sm text-[#374151]">
        {toPersianNumbersWithComma(budget || 0)} تومان
      </span>
      <span className="text-center text-sm text-[#374151]">
        {deadline ? shortDate(deadline) : '-'}
      </span>
      <div className="flex items-center justify-center">
        <span
          className={`inline-flex min-w-[4.5rem] items-center justify-center rounded-[4px] px-2 py-0.5 text-center text-xs font-medium ${statusMeta.className}`}
        >
          {statusMeta.label}
        </span>
      </div>
      <div className="flex items-center justify-center">
        <Link
          to={`/projects/${project._id}`}
          aria-label="مشاهده جزئیات"
          className="text-[#006045] hover:text-[#004d37]"
        >
          <HiOutlineEye className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}

export default FreelancerProjectRow;
