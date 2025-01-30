import useProposals from './useProposals';
import Loading from '../../ui/Loading';
import Empty from '../../ui/Empty';
import Table from '../../ui/Table';
import ProposalRow from './ProposalRow';
import Pagination from '../../ui/Pagination';

import { useState } from 'react';


function ProposalTable() {
  const { isLoading, proposals } = useProposals();

  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) return <Loading />;

  if (!proposals.length) return <Empty resourceName='درخواست'/>;

  const itemsPerPage = 4;

  // Calculate total number of pages
  const totalPages = Math.ceil(proposals.length / itemsPerPage);

  // Get the current page's data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = proposals.slice(startIndex, endIndex);


  return(
    <>
    <Table>
      <Table.Header>
        <th>#</th>
        <th>توضیحات</th>
        <th>زمان تحویل</th>
        <th>هزینه</th>
        <th>وضعیت</th>
      </Table.Header> 
      <Table.Body>
        {currentData.map((proposal, index) => (
          <ProposalRow key={proposal._id} proposal={proposal} index={index} />
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


export default ProposalTable
