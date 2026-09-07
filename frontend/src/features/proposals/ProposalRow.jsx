import truncateText from '../../utils/truncateText';
import { toPersianNumbersWithComma } from '../../utils/toPersianNumbers';
import { formatProposalDuration } from '../../utils/formatProposalDuration';
import { Link } from 'react-router-dom';

const PROPOSALS_GRID_COLS =
  'grid-cols-[minmax(0,2.1fr)_1fr_1fr_1fr_1.1fr]';

const statusStyle = [
  {
    label: 'رد شده',
    className: 'border border-[#F9A8D4] bg-[#FDF2F8] text-[#BE185D]',
  },
  {
    label: 'در انتظار تایید',
    className: 'bg-[#E5E7EB] text-[#374151]',
  },
  {
    label: 'تایید شده',
    className: 'bg-karava-green text-white',
  },
];

function ProposalRow({ proposal }) {
  const { status, description, duration, durationUnit, price, conversationId } =
    proposal;
  const statusMeta = statusStyle[status] || statusStyle[1];

  return (
    <div
      className={`box-border grid min-h-[68px] w-full max-w-[886px] shrink-0 rotate-0 items-center border-b border-[#000000] px-1 py-[19px] opacity-100 transition-colors hover:bg-[#F2FFF8] ${PROPOSALS_GRID_COLS}`}
    >
      <span className="min-w-0 truncate text-center text-sm text-[#374151]">
        {truncateText(description || '', 30)}
      </span>
      <span className="text-center text-sm text-[#374151]">
        {formatProposalDuration(duration, durationUnit)}
      </span>
      <span className="text-center text-sm text-[#374151]">
        {toPersianNumbersWithComma(price)} تومان
      </span>
      <div className="flex items-center justify-center">
        <span
          className={`inline-flex min-w-[7.5rem] items-center justify-center rounded-[4px] px-2 py-0.5 text-center text-xs font-medium ${statusMeta.className}`}
        >
          {statusMeta.label}
        </span>
      </div>
      <div className="flex items-center justify-center">
        {Number(status) === 2 && conversationId ? (
          <Link
            to={`/freelancer/messages/${conversationId}`}
            className="inline-flex h-8 items-center justify-center rounded-[6px] bg-[#006045] px-3 text-xs font-bold text-white hover:bg-[#004d37]"
          >
            شروع گفتگو
          </Link>
        ) : (
          <span className="text-xs text-[#9CA3AF]">—</span>
        )}
      </div>
    </div>
  );
}

export default ProposalRow;
