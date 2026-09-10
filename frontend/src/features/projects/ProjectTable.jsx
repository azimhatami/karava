import useOwnerProjects from './useOwnerProjects';
import Loading from '../../ui/Loading';
import Empty from '../../ui/Empty';
import QueryErrorState from '../../ui/QueryErrorState';
import Table from '../../ui/Table';
import ResponsiveTable from '../../ui/ResponsiveTable';
import Pagination from '../../ui/Pagination';
import ProjectTableRow from './ProjectTableRow';
import { HiOutlineRectangleStack } from 'react-icons/hi2';
import { useState } from 'react';

const COLUMNS = [
  { key: 'index', label: '#' },
  { key: 'title', label: 'عنوان پروژه' },
  { key: 'category', label: 'دسته بندی' },
  { key: 'budget', label: 'بودجه' },
  { key: 'deadline', label: 'ددلاین' },
  { key: 'tags', label: 'تگ ها' },
  { key: 'freelancer', label: 'فریلنسر' },
  { key: 'status', label: 'وضعیت' },
  { key: 'actions', label: 'عملیات' },
  { key: 'proposals', label: 'درخواست ها' },
];

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
    <>
      <ResponsiveTable
        columns={COLUMNS}
        data={currentData}
        desktop={
          <Table>
            <Table.Header>
              {COLUMNS.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
            </Table.Header>
            <Table.Body>
              {currentData.map((project, index) => (
                <ProjectTableRow
                  key={project._id}
                  project={project}
                  index={index}
                />
              ))}
            </Table.Body>
          </Table>
        }
        renderCard={(project, index) => (
          <ProjectTableRow
            project={project}
            index={index}
            variant="card"
          />
        )}
      />
      <Pagination
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </>
  );
}

export default ProjectTable;
