import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Table from '../../ui/Table';
import truncateText from '../../utils/truncateText';
import Modal from '../../ui/Modal';
import ChangeProposalStatus from './ChangeProposalStatus';
import { toPersianNumbersWithComma } from '../../utils/toPersianNumbers';
import { formatProposalDuration } from '../../utils/formatProposalDuration';
import useChangeProposalStatus from './useChangeProposalStatus';
import RatingBadge from '../review/RatingBadge';
import { MobileDataCard } from '../../ui/ResponsiveTable';

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

function ProposalRow({ proposal, index, variant = 'desktop' }) {
  const { status, user } = proposal;
  const statusIndex = Number(status);
  const statusMeta = statusStyle[statusIndex] || statusStyle[1];
  const [open, setOpen] = useState(false);
  const [walletBlocked, setWalletBlocked] = useState(false);
  const conversationId = proposal.conversationId;
  const { id: projectId } = useParams();
  const { isUpdating, changeProposalStatus } = useChangeProposalStatus();

  const updateStatus = (nextStatus) => {
    setWalletBlocked(false);
    changeProposalStatus(
      {
        proposalId: proposal._id,
        projectId,
        status: nextStatus,
      },
      {
        onError: (error) => {
          if (error?.response?.data?.code === 'INSUFFICIENT_WALLET_BALANCE') {
            setWalletBlocked(true);
          }
        },
      },
    );
  };

  const freelancerCell = (
    <div className="flex flex-col items-start gap-1">
      {user?._id ? (
        <Link
          to={`/users/${user._id}`}
          className="font-bold text-[#006045] hover:underline"
        >
          {user?.name || '-'}
        </Link>
      ) : (
        <span>{user?.name || '-'}</span>
      )}
      <RatingBadge
        averageRating={user?.averageRating}
        totalReviews={user?.totalReviews}
      />
    </div>
  );

  const statusBadge = (
    <span className={`badge badge-fixed ${statusMeta.className}`}>
      {statusMeta.label}
    </span>
  );

  const actions = (
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

      {walletBlocked ? (
        <Link
          to="/owner/wallet"
          className="inline-flex h-8 items-center justify-center rounded-[6px] bg-[#FEF9C3] px-3 text-xs font-bold text-[#854D0E] hover:bg-[#FDE047]"
        >
          شارژ کیف پول
        </Link>
      ) : null}
    </div>
  );

  if (variant === 'card') {
    return (
      <MobileDataCard
        title={user?.name || `درخواست ${index + 1}`}
        fields={[
          { key: 'index', label: 'ردیف', value: index + 1 },
          { key: 'freelancer', label: 'فریلنسر', value: freelancerCell },
          {
            key: 'description',
            label: 'توضیحات',
            value: truncateText(proposal.description, 80),
          },
          {
            key: 'duration',
            label: 'زمان تحویل',
            value: formatProposalDuration(
              proposal.duration,
              proposal.durationUnit,
            ),
          },
          {
            key: 'price',
            label: 'هزینه (تومان)',
            value: `${toPersianNumbersWithComma(proposal.price)} تومان`,
          },
          { key: 'status', label: 'وضعیت', value: statusBadge },
        ]}
        actions={actions}
      />
    );
  }

  return (
    <Table.Row>
      <td>{index + 1}</td>
      <td>{freelancerCell}</td>
      <td>
        <p>{truncateText(proposal.description, 30)}</p>
      </td>
      <td>
        {formatProposalDuration(proposal.duration, proposal.durationUnit)}
      </td>
      <td>{toPersianNumbersWithComma(proposal.price)} تومان</td>
      <td>{statusBadge}</td>
      <td>{actions}</td>
    </Table.Row>
  );
}

export default ProposalRow;
