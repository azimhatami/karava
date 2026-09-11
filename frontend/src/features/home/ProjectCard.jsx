import { Link } from 'react-router-dom';
import { HiOutlineStar, HiStar } from 'react-icons/hi2';
import { toPersianNumbersWithComma } from '../../utils/toPersianNumbers';
import truncateText from '../../utils/truncateText';

const statusStyles = {
  OPEN: {
    label: 'باز',
    chip: 'bg-ink-mint-tint text-ink-mint-deep',
    dot: 'bg-ink-mint',
  },
  CLOSED: {
    label: 'بسته',
    chip: 'bg-ink-amber-tint text-ink-amber-deep',
    dot: 'bg-ink-amber',
  },
  COMPLETED: {
    label: 'تکمیل‌شده',
    chip: 'bg-[#EEF1F5] text-[#46586B]',
    dot: 'bg-[#8AA0B6]',
  },
};

function ProjectCard({ project }) {
  const status = statusStyles[project.status] || statusStyles.OPEN;
  const ownerName = project.owner?.name || 'کارفرما';
  const initial = ownerName.trim().charAt(0);
  const totalReviews = project.owner?.totalReviews || 0;
  const averageRating = project.owner?.averageRating || 0;

  return (
    <article className="group flex h-full w-full flex-col rounded-2xl border border-ink-line bg-ink-card p-[22px] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-[3px] hover:border-[#CFD8D2] hover:shadow-[0_14px_34px_rgba(7,20,17,0.10)]">
      <div className="mb-[18px] flex items-center justify-between gap-3">
        <span className="flex h-7 shrink-0 items-center rounded-full bg-ink-well px-3 text-[12.5px] text-ink-muted">
          {project.category?.title || 'بدون دسته'}
        </span>
        <span
          className={`flex h-7 shrink-0 items-center gap-1.5 rounded-full px-3 text-[12.5px] font-bold ${status.chip}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      <h3 className="mb-3 text-[18px] font-bold leading-[1.55] text-ink-text">
        {project.title}
      </h3>

      <p className="mb-5 min-h-[54px] text-sm leading-[1.95] text-ink-muted">
        {truncateText(project.description || '', 90)}
      </p>

      <div className="mb-[22px] mt-auto flex flex-wrap gap-2">
        {(project.tags || []).map((tag) => (
          <span
            key={tag}
            className="flex h-[26px] items-center rounded-md border border-ink-line px-2.5 font-['Sora',_sans-serif] text-xs text-ink-muted"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mb-[18px] h-px bg-ink-hair" />

      <div className="flex items-center justify-between gap-3">
        {project.owner?._id ? (
          <Link
            to={`/users/${project.owner._id}`}
            className="flex min-w-0 items-center gap-2.5"
          >
            <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-ink-raised text-[13px] font-bold text-ink-mint">
              {initial}
            </span>
            <span className="flex min-w-0 flex-col gap-[3px]">
              <span className="truncate text-[13px] font-bold text-ink-text">
                {ownerName}
              </span>
              {totalReviews ? (
                <span className="flex items-center gap-1 text-xs text-[#B26A00]">
                  <HiStar className="h-3 w-3" />
                  {toPersianNumbersWithComma(averageRating)} از{' '}
                  {toPersianNumbersWithComma(totalReviews)} نظر
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-ink-dim">
                  <HiOutlineStar className="h-3 w-3" />
                  بدون امتیاز
                </span>
              )}
            </span>
          </Link>
        ) : (
          <span className="text-[13px] text-ink-dim">{ownerName}</span>
        )}

        <Link
          to={`/projects/${project._id}`}
          className="flex shrink-0 flex-col items-end gap-[3px]"
          aria-label={`مشاهده جزئیات ${project.title}`}
        >
          <span className="text-[11.5px] text-ink-dim">بودجه</span>
          <span className="text-base font-black text-ink-text">
            {toPersianNumbersWithComma(project.budget || 0)}
          </span>
        </Link>
      </div>

      <Link
        to={`/projects/${project._id}`}
        className="mt-4 flex h-11 items-center justify-center rounded-[10px] bg-ink-well text-[13.5px] font-bold text-ink-text transition-colors group-hover:bg-ink-raised group-hover:text-[#F2F6F4]"
      >
        مشاهده جزئیات
      </Link>
    </article>
  );
}

export default ProjectCard;
