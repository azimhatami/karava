import { Link } from 'react-router-dom';
import { HiOutlineEye } from 'react-icons/hi2';
import truncateText from '../../../utils/truncateText';
import shortDate from '../../../utils/shortDate';
import { toPersianNumbersWithComma } from '../../../utils/toPersianNumbers';
import RatingBadge from '../../review/RatingBadge';
import { MobileDataCard } from '../../../ui/ResponsiveTable';

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

function FreelancerProjectRow({ project, variant = 'desktop' }) {
  const { status, title, budget, deadline } = project;
  const statusMeta = projectStatus[status] || projectStatus.CLOSED;

  const statusBadge = (
    <span
      className={`inline-flex min-w-[4.5rem] items-center justify-center rounded-[4px] px-2 py-0.5 text-center text-xs font-medium ${statusMeta.className}`}
    >
      {statusMeta.label}
    </span>
  );

  const ownerCell = project.owner?._id ? (
    <Link
      to={`/users/${project.owner._id}`}
      className="inline-flex items-center gap-1 text-xs text-[#006045] hover:underline"
    >
      {project.owner.name}
      <RatingBadge
        averageRating={project.owner.averageRating}
        totalReviews={project.owner.totalReviews}
        emptyLabel=""
      />
    </Link>
  ) : null;

  const actions = (
    <Link
      to={`/projects/${project._id}`}
      aria-label="مشاهده جزئیات"
      className="inline-flex h-8 items-center gap-2 rounded-[6px] border border-[#006045] bg-white px-3 text-xs font-bold text-[#006045] hover:bg-[#006045] hover:text-white"
    >
      <HiOutlineEye className="h-4 w-4" />
      مشاهده
    </Link>
  );

  if (variant === 'card') {
    return (
      <MobileDataCard
        title={title}
        fields={[
          {
            key: 'owner',
            label: 'کارفرما',
            value: ownerCell || '—',
          },
          {
            key: 'budget',
            label: 'بودجه (تومان)',
            value: `${toPersianNumbersWithComma(budget || 0)} تومان`,
          },
          {
            key: 'deadline',
            label: 'ددلاین',
            value: deadline ? shortDate(deadline) : '—',
          },
          { key: 'status', label: 'وضعیت', value: statusBadge },
        ]}
        actions={actions}
      />
    );
  }

  return (
    <div
      className={`box-border grid min-h-[68px] w-full shrink-0 items-center border-b border-[#000000] px-1 py-[19px] transition-colors hover:bg-[#F2FFF8] ${PROJECTS_GRID_COLS}`}
    >
      <span className="min-w-0 truncate text-center text-sm text-[#374151]">
        <span className="block truncate">{truncateText(title || '', 30)}</span>
        {ownerCell}
      </span>
      <span className="text-center text-sm text-[#374151]">
        {toPersianNumbersWithComma(budget || 0)} تومان
      </span>
      <span className="text-center text-sm text-[#374151]">
        {deadline ? shortDate(deadline) : '-'}
      </span>
      <div className="flex items-center justify-center">{statusBadge}</div>
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
export { PROJECTS_GRID_COLS };
