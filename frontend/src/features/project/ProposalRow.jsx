import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import truncateText from '../../utils/truncateText';
import Modal from '../../ui/Modal';
import ChangeProposalStatus from './ChangeProposalStatus';
import {
  toPersianNumbers,
  toPersianNumbersWithComma,
} from '../../utils/toPersianNumbers';
import { formatProposalDuration } from '../../utils/formatProposalDuration';
import useChangeProposalStatus from './useChangeProposalStatus';
import { DataCard, GridRow, Money, PrimaryCell } from '../../ui/DataTable';

export const PROJECT_PROPOSAL_COLUMNS = [
  { key: 'freelancer', label: 'فریلنسر و پیشنهاد', width: 'minmax(0, 2.4fr)' },
  { key: 'price', label: 'هزینه', width: '1.1fr' },
  { key: 'duration', label: 'زمان تحویل', width: '1fr' },
  { key: 'actions', label: 'عملیات', width: '230px', align: 'end' },
];

/** proposal.status: 0 rejected · 1 pending · 2 accepted */
const STATUS_KEY = ['rejected', 'pending', 'accepted'];

function ProposalRow({ proposal, index, variant = 'desktop' }) {
  const { status, user } = proposal;
  const statusIndex = Number(status);
  const statusKey = STATUS_KEY[statusIndex] || 'pending';
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
      }
    );
  };

  const meta = [
    truncateText(proposal.description || '', 44),
    user?.totalReviews
      ? `${toPersianNumbers(user.averageRating)} از ${toPersianNumbers(
          user.totalReviews
        )} نظر`
      : 'بدون امتیاز',
  ].filter(Boolean);

  const smallBtn =
    'inline-flex h-9 items-center justify-center rounded-[9px] px-3.5 text-[12.5px] font-bold transition-colors disabled:opacity-60';

  const actions = (
    <>
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
            className={`${smallBtn} bg-ink-mint text-ink hover:brightness-105`}
          >
            پذیرش
          </button>
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => updateStatus(0)}
            className={`${smallBtn} border border-ink-line text-ink-muted hover:bg-ink-well hover:text-ink-text`}
          >
            رد
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`${smallBtn} border border-ink-line text-ink-muted hover:bg-ink-well hover:text-ink-text`}
        >
          تغییر وضعیت
        </button>
      )}

      {statusIndex === 2 && conversationId ? (
        <Link
          to={`/owner/messages/${conversationId}`}
          className={`${smallBtn} bg-ink-raised text-[#F2F6F4] hover:brightness-125`}
        >
          گفتگو
        </Link>
      ) : null}

      {walletBlocked ? (
        <Link
          to="/owner/wallet"
          className={`${smallBtn} bg-ink-amber-tint text-ink-amber-deep hover:brightness-95`}
        >
          شارژ کیف پول
        </Link>
      ) : null}
    </>
  );

  if (variant === 'card') {
    return (
      <DataCard
        title={user?.name || `درخواست ${index + 1}`}
        status={statusKey}
        meta={meta}
        stats={[
          {
            label: 'هزینه (تومان)',
            value: toPersianNumbersWithComma(proposal.price),
          },
          {
            label: 'زمان تحویل',
            value: formatProposalDuration(
              proposal.duration,
              proposal.durationUnit
            ),
          },
        ]}
        actions={actions}
      />
    );
  }

  return (
    <GridRow columns={PROJECT_PROPOSAL_COLUMNS}>
      <PrimaryCell
        title={user?.name || '—'}
        avatarName={user?.name}
        status={statusKey}
        meta={meta}
      />
      <Money amount={proposal.price} />
      <span className="text-[13px] text-ink-body">
        {formatProposalDuration(proposal.duration, proposal.durationUnit)}
      </span>
      <div className="flex flex-wrap items-center justify-end gap-2">
        {actions}
      </div>
    </GridRow>
  );
}

export default ProposalRow;
