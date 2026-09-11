import Empty from '../../ui/Empty';
import ResponsiveTable from '../../ui/ResponsiveTable';
import ProposalRow, { PROJECT_PROPOSAL_COLUMNS } from './ProposalRow';
import { GridTable } from '../../ui/DataTable';
import { HiOutlineDocumentText } from 'react-icons/hi2';

function ProposalsTable({ proposals = [] }) {
  if (!proposals.length) {
    return (
      <Empty
        resourceName="درخواستی"
        title="هنوز درخواستی برای این پروژه ثبت نشده"
        description="وقتی فریلنسرها پیشنهاد بفرستند، اینجا نمایش داده می‌شود."
        icon={HiOutlineDocumentText}
      />
    );
  }

  return (
    <ResponsiveTable
      columns={PROJECT_PROPOSAL_COLUMNS}
      data={proposals}
      desktop={
        <GridTable columns={PROJECT_PROPOSAL_COLUMNS} minWidth={900}>
          {proposals.map((proposal, index) => (
            <ProposalRow
              key={proposal._id}
              proposal={proposal}
              index={index}
            />
          ))}
        </GridTable>
      }
      renderCard={(proposal, index) => (
        <ProposalRow proposal={proposal} index={index} variant="card" />
      )}
    />
  );
}

export default ProposalsTable;
