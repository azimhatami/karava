import { useState } from 'react';
import useProposals from './useProposals';
import Loading from '../../ui/Loading';
import Empty from '../../ui/Empty';
import QueryErrorState from '../../ui/QueryErrorState';
import ProposalRow, { PROPOSAL_COLUMNS } from './ProposalRow';
import { GridTable } from '../../ui/DataTable';
import Pagination from '../../ui/Pagination';
import ResponsiveTable from '../../ui/ResponsiveTable';
import { HiOutlineDocumentText } from 'react-icons/hi2';

function ProposalTable() {
  const { isLoading, isError, error, refetch, proposals } = useProposals();
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) return <Loading />;
  if (isError) {
    return <QueryErrorState error={error} onRetry={refetch} />;
  }
  if (!proposals.length) {
    return (
      <Empty
        resourceName="درخواستی"
        title="هنوز درخواستی ارسال نکرده‌اید"
        description="از بخش فرصت‌های شغلی پروژه‌ای را انتخاب و پیشنهاد خود را ثبت کنید."
        icon={HiOutlineDocumentText}
        actionLabel="مشاهده پروژه‌ها"
        actionTo="/freelancer/projects"
      />
    );
  }

  const itemsPerPage = 4;
  const totalPages = Math.ceil(proposals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = proposals.slice(startIndex, endIndex);

  return (
    <section className="flex w-full flex-col gap-3">
      <h3 className="owner-panel-title">درخواست ها</h3>

      <ResponsiveTable
        columns={PROPOSAL_COLUMNS}
        data={currentData}
        desktop={
          <GridTable columns={PROPOSAL_COLUMNS} minWidth={820}>
            {currentData.map((proposal) => (
              <ProposalRow key={proposal._id} proposal={proposal} />
            ))}
          </GridTable>
        }
        renderCard={(proposal) => (
          <ProposalRow proposal={proposal} variant="card" />
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

export default ProposalTable;
