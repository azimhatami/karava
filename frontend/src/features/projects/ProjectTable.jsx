import useOwnerProjects from './useOwnerProjects';
import Loading from '../../ui/Loading';
import Empty from '../../ui/Empty';
import QueryErrorState from '../../ui/QueryErrorState';
import ResponsiveTable from '../../ui/ResponsiveTable';
import Pagination from '../../ui/Pagination';
import ProjectTableRow, { OWNER_PROJECTS_COLUMNS } from './ProjectTableRow';
import { GridTable } from '../../ui/DataTable';
import { HiOutlineRectangleStack } from 'react-icons/hi2';
import { useState } from 'react';

function ProjectTable() {
  const { isLoading, isError, error, refetch, projects } = useOwnerProjects();
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) return <Loading />;
  if (isError) {
    return <QueryErrorState error={error} onRetry={refetch} />;
  }
  if (!projects.length) {
    return (
      <Empty
        resourceName="پروژه‌ای"
        title="هنوز پروژه‌ای ثبت نکرده‌اید"
        description="از دکمه «اضافه کردن پروژه» در بالای صفحه اولین پروژه را ایجاد کنید."
        icon={HiOutlineRectangleStack}
      />
    );
  }

  const itemsPerPage = 4;
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = projects.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col gap-4">
      <ResponsiveTable
        columns={OWNER_PROJECTS_COLUMNS}
        data={currentData}
        desktop={
          <GridTable columns={OWNER_PROJECTS_COLUMNS} minWidth={940}>
            {currentData.map((project) => (
              <ProjectTableRow key={project._id} project={project} />
            ))}
          </GridTable>
        }
        renderCard={(project) => (
          <ProjectTableRow project={project} variant="card" />
        )}
      />
      <Pagination
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
}

export default ProjectTable;
