import Table from '../../ui/Table';
import truncateText from '../../utils/truncateText';
import Modal from '../../ui/Modal';
import ChangeProposalStatus from './ChangeProposalStatus';
import { toPersianNumbersWithComma } from '../../utils/toPersianNumbers';
import { formatProposalDuration } from '../../utils/formatProposalDuration';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useChangeProposalStatus from './useChangeProposalStatus';

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

function ProposalRow({ proposal, index }) {
  const { status, user } = proposal;
  const statusIndex = Number(status);
  const statusMeta = statusStyle[statusIndex] || statusStyle[1];
  const [open, setOpen] = useState(false);
  const conversationId = proposal.conversationId;
  const { id: projectId } = useParams();
  const { isUpdating, changeProposalStatus } = useChangeProposalStatus();

  const updateStatus = (nextStatus) => {
    changeProposalStatus({
      proposalId: proposal._id,
      projectId,
      status: nextStatus,
    });
  };

  return (
    <>
      <Table.Row>
        <td>{index + 1}</td>
        <td>{user?.name || '-'}</td>
        <td>
          <p>{truncateText(proposal.description, 30)}</p>
        </td>
        <td>
          {formatProposalDuration(proposal.duration, proposal.durationUnit)}
        </td>
        <td>{toPersianNumbersWithComma(proposal.price)} تومان</td>
        <td>
          <span className={`badge badge-fixed ${statusMeta.className}`}>
            {statusMeta.label}
          </span>
        </td>
        <td>
          <div className="flex flex-wrap items-center gap-2">
            <Modal
              title="تغییر وضعیت درخواست"
              open={open}
              onClose={() => setOpen(false)}
            >
              <ChangeProposalStatus
                proposalId={proposal._id}
                currentStatus={statusIndex}
                onClose={() => setOpen(false)}
              />
            </Modal>

            {statusIndex === 1 ? (
              <>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => updateStatus(2)}
                  className="inline-flex h-8 items-center justify-center rounded-[6px] bg-[#006045] px-3 text-xs font-bold text-white transition-colors hover:bg-[#004d37] disabled:opacity-60"
                >
                  تایید
                </button>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => updateStatus(0)}
                  className="inline-flex h-8 items-center justify-center rounded-[6px] border border-[#BE185D] bg-white px-3 text-xs font-bold text-[#BE185D] transition-colors hover:bg-[#FFF1F2] disabled:opacity-60"
                >
                  رد
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex h-8 items-center justify-center rounded-[6px] border border-[#006045] bg-white px-3 text-xs font-bold text-[#006045] transition-colors hover:bg-[#006045] hover:text-white"
              >
                تغییر وضعیت
              </button>
            )}

            {statusIndex === 2 && conversationId ? (
              <Link
                to={`/owner/messages/${conversationId}`}
                className="inline-flex h-8 items-center justify-center rounded-[6px] bg-[#006045] px-3 text-xs font-bold text-white transition-colors hover:bg-[#004d37]"
              >
                شروع گفتگو
              </Link>
            ) : null}
          </div>
        </td>
      </Table.Row>
    </>
  );
}

export default ProposalRow;
