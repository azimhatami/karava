import { useState } from 'react';
import useProposals from './useProposals';
import Loading from '../../ui/Loading';
import Empty from '../../ui/Empty';
import ProposalRow from './ProposalRow';
import Pagination from '../../ui/Pagination';

const PROPOSALS_GRID_COLS =
  'grid-cols-[minmax(0,2.1fr)_1fr_1fr_1fr_1.1fr]';

const columns = [
  { key: 'description', label: 'توضیحات' },
  { key: 'duration', label: 'زمان تحویل' },
  { key: 'price', label: 'هزینه (تومان)' },
  { key: 'status', label: 'وضعیت' },
  { key: 'chat', label: 'گفتگو' },
];

function ProposalTable() {
  const { isLoading, proposals } = useProposals();
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) return <Loading />;
  if (!proposals.length) return <Empty resourceName="درخواست" />;

  const itemsPerPage = 4;
  const totalPages = Math.ceil(proposals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = proposals.slice(startIndex, endIndex);

  return (
    <section className="flex w-full max-w-[912px] rotate-0 flex-col gap-[7px] opacity-100">
      <h3 className="owner-panel-title">درخواست ها</h3>

      <div className="flex h-[494px] w-full max-w-[912px] rotate-0 flex-col overflow-hidden rounded-[6px] border border-[#245A49] bg-white p-3 opacity-100">
        <div className="flex min-h-0 w-full max-w-[886px] flex-1 flex-col overflow-auto">
          <div
            className={`grid h-[19px] w-full max-w-[886px] shrink-0 rotate-0 items-center ${PROPOSALS_GRID_COLS} opacity-100`}
          >
            {columns.map((column) => (
              <span
                key={column.key}
                className="h-[19px] rotate-0 whitespace-nowrap text-center font-['Inter'] text-base font-bold leading-none tracking-normal text-[#222020] opacity-100"
              >
                {column.label}
              </span>
            ))}
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            {currentData.map((proposal) => (
              <ProposalRow key={proposal._id} proposal={proposal} />
            ))}
          </div>
        </div>
      </div>

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
