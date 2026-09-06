import truncateText from '../../utils/truncateText';
import { toPersianNumbersWithComma } from '../../utils/toPersianNumbers';
import { formatProposalDuration } from '../../utils/formatProposalDuration';

const PROPOSALS_GRID_COLS =
  'grid-cols-[minmax(0,2.4fr)_1.2fr_1.2fr_1.2fr]';

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
  const { status, description, duration, durationUnit, price } = proposal;
  const statusMeta = statusStyle[status] || statusStyle[1];

  return (
    <div
      className={`box-border grid h-[68px] w-[886px] shrink-0 rotate-0 items-center border-b border-[#000000] px-1 py-[19px] opacity-100 transition-colors hover:bg-[#F2FFF8] ${PROPOSALS_GRID_COLS}`}
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
    </div>
  );
}

export default ProposalRow;
