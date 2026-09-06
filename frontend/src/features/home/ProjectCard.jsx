import { Link } from 'react-router-dom';
import { toPersianNumbersWithComma } from '../../utils/toPersianNumbers';
import truncateText from '../../utils/truncateText';

function ProjectCard({ project }) {
  const isOpen = project.status === 'OPEN';

  return (
    <article className="mx-auto flex h-[347px] w-full max-w-[392px] flex-col gap-[18px] rounded-[12px] border border-[#00362E] bg-white p-3 opacity-100">
      <div className="flex h-[223px] w-full max-w-[366px] flex-col gap-[22px] border-b border-[#6E6E6E] opacity-100">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex h-[29px] w-auto max-w-full shrink-0 items-center whitespace-nowrap rounded-[6px] border border-[#0D4B39] bg-[#CDFFEC] p-1.5 text-xs font-medium text-[#0D4B39] opacity-100">
            {project.category?.title || 'بدون دسته'}
          </span>
          <span
            className={
              isOpen
                ? 'inline-flex h-[29px] w-[58px] items-center justify-center gap-[10px] rounded-[6px] border border-[#00D281] bg-[#008245] p-0.5 text-xs font-medium text-white opacity-100'
                : 'inline-flex h-[29px] w-[58px] items-center justify-center gap-[10px] rounded-[6px] border border-[#C9093D] bg-[#FFF1F2] p-0.5 text-xs font-medium text-[#BE185D] opacity-100'
            }
          >
            {isOpen ? 'باز' : 'بسته'}
          </span>
        </div>

        <div className="flex h-[139px] w-full max-w-[366px] flex-col gap-[23px] opacity-100">
          <h3 className="h-[17px] w-full max-w-[366px] truncate text-right font-['Inter'] text-[14px] font-bold leading-none tracking-normal text-[#0F172B] opacity-100">
            {project.title}
          </h3>
          <p className="h-[51px] w-full max-w-[366px] overflow-hidden text-right font-['Inter'] text-[14px] font-medium leading-none tracking-normal text-[#677487] opacity-100">
            {truncateText(project.description || '', 90)}
          </p>

          <div className="flex flex-wrap gap-2">
            {(project.tags || []).map((tag) => (
              <span
                key={tag}
                className="group inline-flex h-[29px] w-auto min-w-0 shrink-0 items-center justify-between gap-1.5 whitespace-nowrap rounded-[6px] border border-[#007A55] bg-[#8EC3A9] p-1.5 text-xs text-white opacity-100"
              >
                <span className="relative h-[10px] w-[10px] shrink-0">
                  <svg
                    className="absolute left-[0.83px] top-[0.83px] h-[8.33px] w-[8.33px] rotate-0 text-white opacity-100 group-hover:text-[#007A55]"
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

      <div className="mt-auto flex h-[80px] w-full max-w-[366px] items-center justify-between p-3 opacity-100">
        <p className="flex h-[56px] w-[138px] flex-col justify-center gap-[18px] text-right text-sm text-[#374151] opacity-100">
          <span className="block">بودجه پروژه:</span>
          <span>
            <span className="font-bold text-karava-green">
              {toPersianNumbersWithComma(project.budget || 0)}
            </span>{' '}
            تومان
          </span>
        </p>
        <Link
          to={`/projects/${project._id}`}
          className="inline-flex h-5 w-[161px] items-center justify-between overflow-visible text-[#4A9CFC] opacity-100"
        >
          <span className="h-[19px] w-[131px] text-right font-['Inter'] text-[16px] font-normal leading-none tracking-normal text-[#4A9CFC]">
            مشاهده جزئیات
          </span>
          <span className="flex h-5 w-5 shrink-0 items-center justify-center">
            <svg
              className="h-5 w-5"
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
          </span>
        </Link>
      </div>
    </article>
  );
}

export default ProjectCard;
