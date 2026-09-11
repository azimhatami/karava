import { useState } from 'react';
import Loading from '../../../ui/Loading';
import Empty from '../../../ui/Empty';
import QueryErrorState from '../../../ui/QueryErrorState';
import Pagination from '../../../ui/Pagination';
import FreelancerProjectRow, {
  FREELANCER_PROJECT_COLUMNS,
} from './FreelancerProjectRow';
import { GridTable } from '../../../ui/DataTable';
import useProjects from '../../../hooks/useProjects';
import ResponsiveTable from '../../../ui/ResponsiveTable';
import { HiOutlineBriefcase } from 'react-icons/hi2';

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
    <section className="flex w-full flex-col gap-4">
      <ResponsiveTable
        columns={FREELANCER_PROJECT_COLUMNS}
        data={currentData}
        desktop={
          <GridTable columns={FREELANCER_PROJECT_COLUMNS} minWidth={820}>
            {currentData.map((project) => (
              <FreelancerProjectRow key={project._id} project={project} />
            ))}
          </GridTable>
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
