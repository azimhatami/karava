import Empty from '../../ui/Empty';
import Table from '../../ui/Table';
import ResponsiveTable from '../../ui/ResponsiveTable';
import ProposalRow from './ProposalRow';
import { HiOutlineDocumentText } from 'react-icons/hi2';

const COLUMNS = [
  { key: 'index', label: '#' },
  { key: 'freelancer', label: 'فریلنسر' },
  { key: 'description', label: 'توضیحات' },
  { key: 'duration', label: 'زمان تحویل' },
  { key: 'price', label: 'هزینه (تومان)' },
  { key: 'status', label: 'وضعیت' },
  { key: 'actions', label: 'عملیات' },
];

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
      columns={COLUMNS}
      data={proposals}
      desktop={
        <Table>
          <Table.Header>
            {COLUMNS.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </Table.Header>
          <Table.Body>
            {proposals.map((proposal, index) => (
              <ProposalRow
                key={proposal._id}
                proposal={proposal}
                index={index}
              />
            ))}
          </Table.Body>
        </Table>
      }
      renderCard={(proposal, index) => (
        <ProposalRow proposal={proposal} index={index} variant="card" />
      )}
    />
  );
}

export default ProposalsTable;
