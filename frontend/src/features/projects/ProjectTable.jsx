import useOwnerProjects from './useOwnerProjects';
import Loading from '../../ui/Loading';
import Empty from '../../ui/Empty';
import Table from '../../ui/Table';
import Pagination from '../../ui/Pagination';
import ProjectTableRow from './ProjectTableRow';

import { useState } from 'react';


function ProjectTable() {
  const { isLoading, projects } = useOwnerProjects();
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) return <Loading />;

  if (!projects.length) return <Empty />;

  const itemsPerPage = 4

  // Calculate total number of pages
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  // Get the current page's data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = projects.slice(startIndex, endIndex);

  return(
    <>
    <Table>
      <Table.Header>
        <th>#</th>
        <th>عنوان پروژه</th>
        <th>دسته بندی</th>
        <th>بودجه</th>
        <th>ددلاین</th>
        <th>تگ ها</th>
        <th>فریلنسر</th>
        <th>وضعیت</th>
        <th>عملیات</th>
        <th>درخواست ها</th>
      </Table.Header> 
      <Table.Body>
        {currentData.map((project, index) => (
          <ProjectTableRow key={project._id} project={project} index={index} />
        ))}
      </Table.Body>
    </Table>
    <Pagination 
      itemsPerPage={itemsPerPage}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      totalPages={totalPages}
    />
    </>
  );
}


export default ProjectTable
