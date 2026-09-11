import truncateText from '../../utils/truncateText';
import { toPersianNumbersWithComma } from '../../utils/toPersianNumbers';
import { formatProposalDuration } from '../../utils/formatProposalDuration';
import { Link } from 'react-router-dom';
import {
  DataCard,
  GridRow,
  Money,
  PrimaryCell,
} from '../../ui/DataTable';

export const PROPOSAL_COLUMNS = [
  { key: 'proposal', label: 'پروژه و پیشنهاد شما', width: 'minmax(0, 2.6fr)' },
  { key: 'price', label: 'مبلغ پیشنهادی', width: '1.1fr' },
  { key: 'duration', label: 'زمان تحویل', width: '1fr' },
  { key: 'actions', label: 'عملیات', width: '210px', align: 'end' },
];

/** proposal.status: 0 rejected · 1 pending · 2 accepted */
const STATUS_KEY = ['rejected', 'pending', 'accepted'];

function ProposalRow({ proposal, variant = 'desktop' }) {
  const {
    status,
    description,
    duration,
    durationUnit,
    price,
    conversationId,
    projectTitle,
    projectId,
    projectStatus,
  } = proposal;

  const statusKey = STATUS_KEY[Number(status)] || 'pending';
  const title = projectTitle || truncateText(description || 'پیشنهاد', 40);
  const meta = [truncateText(description || '', 46)].filter(Boolean);

  const actions = (
    <>
      {Number(status) === 2 && conversationId ? (
        <Link
          to={`/freelancer/messages/${conversationId}`}
          className="inline-flex h-9 items-center justify-center rounded-[9px] bg-ink-raised px-3.5 text-[12.5px] font-bold text-[#F2F6F4] transition-[filter] hover:brightness-125"
        >
          شروع گفتگو
        </Link>
      ) : null}
      {projectId ? (
        <Link
          to={`/projects/${projectId}`}
          className="inline-flex h-9 items-center justify-center rounded-[9px] border border-ink-line px-3.5 text-[12.5px] font-bold text-ink-muted transition-colors hover:bg-ink-well hover:text-ink-text"
        >
          {projectStatus === 'COMPLETED' ? 'ثبت نظر' : 'مشاهده پروژه'}
        </Link>
      ) : null}
      {!conversationId && !projectId ? (
        <span className="text-xs text-ink-dim">—</span>
      ) : null}
    </>
  );

  if (variant === 'card') {
    return (
      <DataCard
        title={title}
        status={statusKey}
        meta={meta}
        stats={[
          {
            label: 'مبلغ پیشنهادی (تومان)',
            value: toPersianNumbersWithComma(price),
          },
          {
            label: 'زمان تحویل',
            value: formatProposalDuration(duration, durationUnit),
          },
        ]}
        actions={actions}
      />
    );
  }

  return (
    <GridRow columns={PROPOSAL_COLUMNS}>
      <PrimaryCell title={title} status={statusKey} meta={meta} />
      <Money amount={price} />
      <span className="text-[13px] text-ink-body">
        {formatProposalDuration(duration, durationUnit)}
      </span>
      <div className="flex flex-wrap items-center justify-end gap-2">
        {actions}
      </div>
    </GridRow>
  );
}

export default ProposalRow;
