import { useState } from 'react';
import useProposals from './useProposals';
import Loading from '../../ui/Loading';
import Empty from '../../ui/Empty';
import QueryErrorState from '../../ui/QueryErrorState';
import ProposalRow, { PROPOSALS_GRID_COLS } from './ProposalRow';
import Pagination from '../../ui/Pagination';
import ResponsiveTable from '../../ui/ResponsiveTable';
import { HiOutlineDocumentText } from 'react-icons/hi2';

const columns = [
  { key: 'description', label: 'توضیحات' },
  { key: 'duration', label: 'زمان تحویل' },
  { key: 'price', label: 'هزینه (تومان)' },
  { key: 'status', label: 'وضعیت' },
  { key: 'chat', label: 'گفتگو' },
];

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
        columns={columns}
        data={currentData}
        desktop={
          <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-ink-line bg-ink-card">
            <div className="min-h-0 w-full flex-1 overflow-x-auto">
              <div className="flex min-h-0 min-w-[640px] flex-1 flex-col">
                <div
                  className={`grid h-[19px] w-full shrink-0 items-center ${PROPOSALS_GRID_COLS}`}
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
                  {currentData.map((proposal) => (
                    <ProposalRow key={proposal._id} proposal={proposal} />
                  ))}
                </div>
              </div>
            </div>
          </div>
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
