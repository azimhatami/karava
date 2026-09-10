import { Link } from 'react-router-dom';
import { toPersianNumbersWithComma } from '../../utils/toPersianNumbers';
import truncateText from '../../utils/truncateText';
import RatingBadge from '../review/RatingBadge';

function ProjectCard({ project }) {
  const isOpen = project.status === 'OPEN';

  return (
    <article className="mx-auto flex h-full min-h-[347px] w-full max-w-[392px] flex-col gap-[18px] rounded-[12px] border border-[#00362E] bg-white p-3">
      <div className="flex w-full max-w-[366px] flex-1 flex-col gap-[22px] border-b border-[#6E6E6E] pb-4">
        <div className="flex shrink-0 items-center justify-between gap-2">
          <span className="inline-flex h-[29px] max-w-full shrink-0 items-center whitespace-nowrap rounded-[6px] border border-[#0D4B39] bg-[#CDFFEC] px-1.5 text-xs font-medium text-[#0D4B39]">
            {project.category?.title || 'بدون دسته'}
          </span>
          <span
            className={
              isOpen
                ? 'inline-flex h-[29px] w-[58px] shrink-0 items-center justify-center rounded-[6px] border border-[#00D281] bg-[#008245] text-xs font-medium text-white'
                : 'inline-flex h-[29px] w-[58px] shrink-0 items-center justify-center rounded-[6px] border border-[#C9093D] bg-[#FFF1F2] text-xs font-medium text-[#BE185D]'
            }
          >
            {isOpen ? 'باز' : 'بسته'}
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <h3 className="shrink-0 overflow-visible text-right text-sm font-bold leading-6 text-[#0F172B]">
            {project.title}
          </h3>

          {project.owner?._id ? (
            <Link
              to={`/users/${project.owner._id}`}
              className="flex shrink-0 items-center justify-between gap-2 text-right"
            >
              <span className="min-w-0 truncate text-xs font-bold leading-5 text-[#006045]">
                {project.owner?.name || 'کارفرما'}
              </span>
              <RatingBadge
                averageRating={project.owner?.averageRating}
                totalReviews={project.owner?.totalReviews}
              />
            </Link>
          ) : null}

          <p className="line-clamp-3 min-h-0 text-right text-sm font-medium leading-6 text-[#677487]">
            {truncateText(project.description || '', 90)}
          </p>

          <div className="mt-auto flex flex-wrap gap-2">
            {(project.tags || []).map((tag) => (
              <span
                key={tag}
                className="group inline-flex h-[29px] max-w-full shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[6px] border border-[#007A55] bg-[#8EC3A9] px-1.5 text-xs text-white"
              >
                <span className="relative h-[10px] w-[10px] shrink-0">
                  <svg
                    className="absolute left-[0.83px] top-[0.83px] h-[8.33px] w-[8.33px] text-white group-hover:text-[#007A55]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M21.41 11.58 12.41 2.58A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .59 1.41l9 9a2 2 0 0 0 2.82 0l7-7a2 2 0 0 0 0-2.83ZM5.5 7A1.5 1.5 0 1 1 7 5.5 1.5 1.5 0 0 1 5.5 7Z" />
                  </svg>
                </span>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto flex w-full max-w-[366px] shrink-0 items-center justify-between gap-3 p-3">
        <p className="flex min-w-0 flex-col gap-2 text-right text-sm leading-5 text-[#374151]">
          <span>بودجه پروژه:</span>
          <span>
            <span className="font-bold text-karava-green">
              {toPersianNumbersWithComma(project.budget || 0)}
            </span>{' '}
            تومان
          </span>
        </p>
        <Link
          to={`/projects/${project._id}`}
          className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-base leading-5 text-[#4A9CFC]"
        >
          <span>مشاهده جزئیات</span>
          <svg
            className="h-5 w-5 shrink-0"
            viewBox="3 5 18 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19.5 12H4.5m0 0 6.75 6.75M4.5 12l6.75-6.75" />
          </svg>
        </Link>
      </div>
    </article>
  );
}

export default ProjectCard;
