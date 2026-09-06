import Table from '../../ui/Table';
import truncateText from '../../utils/truncateText';
import Modal from '../../ui/Modal';
import ChangeProposalStatus from './ChangeProposalStatus';
import { toPersianNumbersWithComma } from '../../utils/toPersianNumbers';
import { formatProposalDuration } from '../../utils/formatProposalDuration';
import { useState } from 'react';

function ProposalRow({ proposal, index }) {
  const { status, user } = proposal;

  const statusStyle = [
    {
      label: 'رد شده',
      className: 'badge-danger',
    },
    {
      label: 'در انتظار تایید',
      className: 'badge-secondary',
    },
    {
      label: 'تایید شده',
      className: 'badge-success',
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <>
      <Table.Row>
        <td>{index + 1}</td>
        <td>{user.name}</td>
        <td>
          <p>{truncateText(proposal.description, 30)}</p>
        </td>
        <td>
          {formatProposalDuration(proposal.duration, proposal.durationUnit)}
        </td>
        <td>{toPersianNumbersWithComma(proposal.price)} تومان</td>
        <td>
          <span className={`badge badge-fixed ${statusStyle[status].className}`}>
            {statusStyle[status].label}
          </span>
        </td>
        <td>
          <Modal
            title="تغییر وضعیت درخواست"
            open={open}
            onClose={() => setOpen(false)}
          >
            <ChangeProposalStatus
              proposalId={proposal._id}
              onClose={() => setOpen(false)}
            />
          </Modal>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-8 items-center justify-center rounded-[6px] border border-[#006045] bg-white px-3 text-xs font-bold text-[#006045] transition-colors hover:bg-[#006045] hover:text-white"
          >
            تغییر وضعیت
          </button>
        </td>
      </Table.Row>
    </>
  );
}

export default ProposalRow;
