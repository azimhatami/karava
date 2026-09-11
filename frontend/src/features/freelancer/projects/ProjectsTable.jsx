import { useState } from 'react';
import Loading from '../../../ui/Loading';
import Empty from '../../../ui/Empty';
import QueryErrorState from '../../../ui/QueryErrorState';
import Pagination from '../../../ui/Pagination';
import FreelancerProjectRow, {
  PROJECTS_GRID_COLS,
} from './FreelancerProjectRow';
import useProjects from '../../../hooks/useProjects';
import ResponsiveTable from '../../../ui/ResponsiveTable';
import { HiOutlineBriefcase } from 'react-icons/hi2';

const columns = [
  { key: 'title', label: 'عنوان پروژه' },
  { key: 'budget', label: 'بودجه (تومان)' },
  { key: 'deadline', label: 'ددلاین' },
  { key: 'status', label: 'وضعیت' },
  { key: 'actions', label: 'عملیات' },
];

function ProjectsTable() {
  const { isLoading, isError, error, refetch, projects } = useProjects();
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) return <Loading />;
  if (isError) {
    return <QueryErrorState error={error} onRetry={refetch} />;
  }
  if (!projects.length) {
    return (
      <Empty
        resourceName="پروژه‌ای"
        title="پروژه‌ای برای نمایش وجود ندارد"
        description="فعلاً فرصت شغلی بازی مطابق فیلترها پیدا نشد. بعداً دوباره سر بزنید."
        icon={HiOutlineBriefcase}
      />
    );
  }

  const itemsPerPage = 4;
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = projects.slice(startIndex, endIndex);

  return (
    <section className="flex w-full flex-col gap-[7px]">
      <ResponsiveTable
        columns={columns}
        data={currentData}
        desktop={
          <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-ink-line bg-ink-card">
            <div className="min-h-0 w-full flex-1 overflow-x-auto">
              <div className="flex min-h-0 min-w-[640px] flex-1 flex-col">
                <div
                  className={`grid h-[19px] w-full shrink-0 items-center ${PROJECTS_GRID_COLS}`}
                >
                  {columns.map((column) => (
                    <span
                      key={column.key}
                      className="h-[19px] whitespace-nowrap text-center text-base font-bold leading-none text-[#222020]"
                    >
                      {column.label}
                    </span>
                  ))}
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
                  {currentData.map((project) => (
                    <FreelancerProjectRow key={project._id} project={project} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        }
        renderCard={(project) => (
          <FreelancerProjectRow project={project} variant="card" />
        )}
      />

      <Pagination
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </section>
  );
}

export default ProjectsTable;
