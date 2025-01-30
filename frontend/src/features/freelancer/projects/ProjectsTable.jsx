import Loading from '../../../ui/Loading';
import Empty from '../../../ui/Empty';
import Table from '../../../ui/Table';
import Pagination from '../../../ui/Pagination';
import ProjectRow from './ProjectRow';
import useProjects from '../../../hooks/useProjects';

import { useState } from 'react';


function ProjectsTable() {
  const { isLoading, projects } = useProjects();
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) return <Loading />;

  if (!projects.length) return <Empty />;

  const itemsPerPage = 3

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
        <th>بودجه</th>
        <th>ددلاین</th>
        <th>وضعیت</th>
        <th>عملیات</th>
      </Table.Header> 
      <Table.Body>
        {currentData.map((project, index) => (
          <ProjectRow key={project._id} project={project} index={index} />
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


export default ProjectsTable
